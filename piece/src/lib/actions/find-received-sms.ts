import { createAction } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { smsGoraAuth } from '../auth';
import { smsGoraApi } from '../common';
import { smsGoraProps } from '../common/props';

export const findReceivedSmsAction = createAction({
  auth: smsGoraAuth,
  name: 'find_received_sms',
  classification: 'SEARCH',
  displayName: 'Find Received SMS',
  description: 'List SMS received by your phones.',
  audience: 'both',
  aiMetadata: {
    description:
      'List incoming SMS received by the linked phones, newest first, optionally for one phone, one sender number or since a date. For real-time handling use the New SMS Event trigger instead. Read-only, safe to retry.',
    idempotent: true,
  },
  props: {
    device_id: smsGoraProps.device({ required: false, description: 'Only SMS received by this phone. Leave empty for all phones.' }),
    phone: smsGoraProps.phone,
    since: smsGoraProps.since,
    limit: smsGoraProps.limit,
  },
  async run(context) {
    const { device_id, phone, since, limit } = context.propsValue;
    return smsGoraApi.call({
      apiKey: context.auth.secret_text,
      method: HttpMethod.GET,
      path: device_id ? `/devices/${device_id}/get-received-sms` : '/received-sms',
      query: smsGoraApi.cleanQuery({ phone, since: since ? new Date(since).toISOString() : undefined, limit }),
    });
  },
});
