import { createTrigger, Property, TriggerStrategy } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { smsGoraAuth } from '../auth';
import { smsGoraApi } from '../common';
import { smsGoraProps } from '../common/props';

export const newSmsEventTrigger = createTrigger({
  auth: smsGoraAuth,
  name: 'new_sms_event',
  classification: 'READ',
  displayName: 'New SMS Event',
  description: 'Starts when one of your phones receives an SMS, or a sent SMS is sent, delivered or fails.',
  aiMetadata: {
    description:
      'Fires once per SMS event from the SMS Gora account: an incoming SMS on a linked phone, or a status change (sent, delivered, failed) of an outgoing SMS. The payload holds the event name and the message details.',
  },
  props: {
    events: Property.StaticMultiSelectDropdown({
      displayName: 'Events',
      description: 'Which events start the flow.',
      required: true,
      defaultValue: ['sms.received'],
      options: {
        options: [
          { label: 'SMS Received', value: 'sms.received' },
          { label: 'SMS Sent', value: 'sms.sent' },
          { label: 'SMS Delivered', value: 'sms.delivered' },
          { label: 'SMS Failed', value: 'sms.failed' },
        ],
      },
    }),
    device_id: smsGoraProps.device({
      required: false,
      description: 'Only events from this phone. Leave empty for all your phones.',
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    event: 'sms.received',
    timestamp: '2026-11-11T09:30:00Z',
    data: {
      id: 48213,
      device_id: 12,
      direction: 'in',
      phone: '+250788123456',
      message: 'Hello, is my order ready?',
      sim_slot: 0,
      status: 'received',
      created_at: '2026-11-11T09:30:00Z',
    },
  },
  async onEnable(context) {
    const created = await smsGoraApi.call<{ id?: number | string; secret?: string }>({
      apiKey: context.auth.secret_text,
      method: HttpMethod.POST,
      path: '/webhooks',
      body: {
        url: context.webhookUrl,
        events: context.propsValue.events,
        device_id: context.propsValue.device_id ?? null,
      },
    });
    if (created.id === undefined) {
      throw new Error('SMS Gora did not return a webhook ID.');
    }
    await context.store.put<StoredWebhook>(STORE_KEY, { id: String(created.id), secret: created.secret ?? '' });
  },
  async onDisable(context) {
    const stored = await context.store.get<StoredWebhook>(STORE_KEY);
    if (stored?.id) {
      await smsGoraApi.call({
        apiKey: context.auth.secret_text,
        method: HttpMethod.DELETE,
        path: `/webhooks/${stored.id}`,
      });
      await context.store.delete(STORE_KEY);
    }
  },
  async run(context) {
    const stored = await context.store.get<StoredWebhook>(STORE_KEY);
    const headers = context.payload.headers ?? {};
    if (stored?.secret) {
      const valid = smsGoraApi.verifySignature({
        rawBody: context.payload.rawBody,
        body: context.payload.body,
        signature: headers['x-smsgora-signature'],
        secret: stored.secret,
      });
      if (!valid) {
        return [];
      }
    }
    return [context.payload.body];
  },
});

const STORE_KEY = 'smsgora_webhook';

type StoredWebhook = { id: string; secret: string };
