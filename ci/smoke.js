const assert = require('assert');
const crypto = require('crypto');
const path = require('path');

const dir = path.resolve(process.argv[2]);
const pkg = require(path.join(dir, 'package.json'));
const mod = require(path.join(dir, pkg.main));
const piece = mod.smsGora;

async function main() {
  assert.ok(piece, 'smsGora export missing');
  const actions = Object.keys(piece.actions()).sort();
  const expected = ['cancel_message', 'custom_api_call', 'find_messages', 'find_received_sms', 'get_account', 'get_message', 'get_phone', 'list_phones', 'send_bulk_sms', 'send_sms'];
  assert.deepStrictEqual(actions, expected);
  assert.deepStrictEqual(Object.keys(piece.triggers()), ['new_sms_event']);
  for (const name of actions.filter((a) => a !== 'custom_api_call')) {
    const a = piece.getAction(name);
    assert.ok(a.aiMetadata && a.aiMetadata.description, `${name}: aiMetadata`);
    assert.ok(a.classification, `${name}: classification`);
    assert.strictEqual(a.audience, 'both', `${name}: audience`);
  }
  console.log('ok  metadata:', actions.length, 'actions, 1 trigger');

  const bad = await piece.auth.validate({ auth: 'sgk_invalid_ci_smoke_test' });
  assert.strictEqual(bad.valid, false);
  console.log('ok  invalid key rejected by the live API:', bad.error);

  const trigger = piece.getTrigger('new_sms_event');
  const secret = 'whsec_test';
  const body = { event: 'sms.received', data: { phone: '+250788123456', message: 'Muraho / café' } };
  const compact = JSON.stringify(body);
  const php = compact.split('/').join(String.fromCharCode(92) + '/').replace(new RegExp('[' + String.fromCharCode(0x7f) + '-' + String.fromCharCode(0xffff) + ']', 'g'), (c) => String.fromCharCode(92) + 'u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
  const sign = (s) => 'sha256=' + crypto.createHmac('sha256', secret).update(s).digest('hex');
  const store = { get: async () => ({ id: '1', secret }) };
  const run = (headers, rawBody) => trigger.run({ store, payload: { body, headers, rawBody, queryParams: {} } });

  assert.deepStrictEqual(await run({ 'x-smsgora-signature': sign(compact) }), [body]);
  assert.deepStrictEqual(await run({ 'x-smsgora-signature': sign(php) }), [body]);
  assert.deepStrictEqual(await run({ 'x-smsgora-signature': sign('raw') }, 'raw'), [body]);
  assert.deepStrictEqual(await run({ 'x-smsgora-signature': sign('tampered') }), []);
  assert.deepStrictEqual(await run({}), []);
  console.log('ok  webhook signature: valid accepted (raw, compact, PHP JSON), wrong/missing rejected');

  const noSecret = { get: async () => ({ id: '1', secret: '' }) };
  assert.deepStrictEqual(await trigger.run({ store: noSecret, payload: { body, headers: {}, queryParams: {} } }), [body]);
  console.log('ok  all smoke tests passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
