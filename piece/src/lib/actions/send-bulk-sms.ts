import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { smsGoraAuth } from '../auth';
import { smsGoraApi } from '../common';
import { smsGoraProps } from '../common/props';

export const sendBulkSmsAction = createAction({
  auth: smsGoraAuth,
  name: 'send_bulk_sms',
  classification: 'WRITE',
  displayName: 'Send Bulk SMS',
  description: 'Send different texts to different people in one go.',
  audience: 'both',
  aiMetadata: {
    description:
      'Send personalised SMS in one call: each entry has its own recipients and optional own text, falling back to a shared template. Use Send SMS when everyone gets the same text. Up to 5,000 recipients; retrying sends duplicates.',
    idempotent: false,
  },
  props: {
    device_id: smsGoraProps.device({ required: true, description: 'The phone that sends the messages.' }),
    message_template: Property.LongText({
      displayName: 'Default Text',
      description: 'Used for every entry that has no text of its own.',
      required: false,
    }),
    messages: Property.Array({
      displayName: 'Messages',
      description: 'One entry per group of recipients (up to 5,000 recipients in total).',
      required: true,
      properties: {
        recipients: Property.ShortText({
          displayName: 'Recipients',
          description: 'Numbers in international format, separated by commas.',
          required: true,
        }),
        text: Property.LongText({
          displayName: 'Text',
          description: 'Own text for these numbers. Leave empty to use the default text.',
          required: false,
        }),
      },
    }),
  },
  async run(context) {
    const { device_id, message_template, messages } = context.propsValue;
    const entries = (messages ?? []).map((entry) => {
      const item = entry as { recipients?: string; text?: string };
      return {
        recipients: smsGoraApi.splitNumbers(item.recipients),
        ...(item.text ? { message: item.text } : {}),
      };
    });
    const missingText = entries.some((e) => !('message' in e)) && !message_template;
    if (entries.length === 0 || entries.some((e) => e.recipients.length === 0)) {
      throw new Error('Every entry needs at least one recipient.');
    }
    if (missingText) {
      throw new Error('Add a default text, or a text on every entry.');
    }
    return smsGoraApi.call({
      apiKey: context.auth.secret_text,
      method: HttpMethod.POST,
      path: `/devices/${device_id}/send-bulk-sms`,
      body: {
        messages: entries,
        ...(message_template ? { messageTemplate: message_template } : {}),
      },
    });
  },
});
