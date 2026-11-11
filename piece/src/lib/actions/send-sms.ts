import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { smsGoraAuth } from '../auth';
import { smsGoraApi } from '../common';
import { smsGoraProps } from '../common/props';

export const sendSmsAction = createAction({
  auth: smsGoraAuth,
  name: 'send_sms',
  classification: 'WRITE',
  displayName: 'Send SMS',
  description: 'Send an SMS from one of your Android phones to one or more numbers.',
  audience: 'both',
  aiMetadata: {
    description:
      'Send the same SMS text to one or more phone numbers through the user\'s own Android phone linked to SMS Gora. Use Send Bulk SMS instead when different people need different texts. Each call sends again, so retrying sends duplicates.',
    idempotent: false,
  },
  props: {
    to: Property.ShortText({
      displayName: 'To',
      description: 'One or more numbers in international format, separated by commas (up to 1,000), e.g. +250788123456, +15551234567',
      required: true,
    }),
    message: Property.LongText({
      displayName: 'Message',
      description: 'The text to send (up to 1,600 characters).',
      required: true,
    }),
    device_id: smsGoraProps.device({
      required: false,
      description: 'The phone that sends the SMS. Leave empty to use your best online phone.',
    }),
    sim_slot: Property.StaticDropdown({
      displayName: 'SIM',
      description: 'Which SIM card to send from, on dual-SIM phones.',
      required: false,
      options: {
        options: [
          { label: 'SIM 1', value: 0 },
          { label: 'SIM 2', value: 1 },
        ],
      },
    }),
    schedule_at: Property.DateTime({
      displayName: 'Send At',
      description: 'Schedule the SMS for later. Leave empty to send now.',
      required: false,
    }),
  },
  async run(context) {
    const { to, message, device_id, sim_slot, schedule_at } = context.propsValue;
    const recipients = smsGoraApi.splitNumbers(to);
    if (recipients.length === 0) {
      throw new Error('Add at least one phone number in "To".');
    }
    return smsGoraApi.call({
      apiKey: context.auth.secret_text,
      method: HttpMethod.POST,
      path: device_id ? `/devices/${device_id}/send-sms` : '/send-sms',
      body: {
        recipients,
        message,
        ...(sim_slot !== undefined && sim_slot !== null ? { sim_slot } : {}),
        ...(schedule_at ? { schedule_at: new Date(schedule_at).toISOString() } : {}),
      },
    });
  },
});
