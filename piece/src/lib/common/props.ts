import { Property } from '@activepieces/pieces-framework';
import { smsGoraAuth } from '../auth';
import { smsGoraApi } from '.';

export const smsGoraProps = {
  device: ({ required, description }: { required: boolean; description: string }) =>
    Property.Dropdown({
      auth: smsGoraAuth,
      displayName: 'Phone',
      description,
      required,
      refreshers: [],
      options: async ({ auth }) => smsGoraApi.deviceOptions(auth?.secret_text),
    }),
  messageId: Property.Number({
    displayName: 'Message ID',
    description: 'The message ID returned by Send SMS (one ID per recipient), or shown in the SMS Gora message log.',
    required: true,
  }),
  limit: Property.Number({
    displayName: 'Limit',
    description: 'Maximum number of results to return.',
    required: false,
    defaultValue: 50,
  }),
  phone: Property.ShortText({
    displayName: 'Phone Number',
    description: 'Only messages to or from this number, in international format (e.g. +250788123456).',
    required: false,
  }),
  since: Property.DateTime({
    displayName: 'Since',
    description: 'Only messages created after this date and time.',
    required: false,
  }),
};
