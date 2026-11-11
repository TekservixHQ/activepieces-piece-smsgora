import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { smsGoraAuth } from '../auth';
import { smsGoraApi } from '../common';
import { smsGoraProps } from '../common/props';

export const findMessagesAction = createAction({
  auth: smsGoraAuth,
  name: 'find_messages',
  classification: 'SEARCH',
  displayName: 'Find Messages',
  description: 'List sent or received messages, with optional filters.',
  audience: 'both',
  aiMetadata: {
    description:
      'List SMS messages newest first, filtered by direction (sent or received), status, phone number and date. Use Get Message when you already have the ID. Read-only, safe to retry.',
    idempotent: true,
  },
  props: {
    direction: Property.StaticDropdown({
      displayName: 'Direction',
      required: false,
      defaultValue: 'out',
      options: {
        options: [
          { label: 'Sent', value: 'out' },
          { label: 'Received', value: 'in' },
        ],
      },
    }),
    status: Property.StaticDropdown({
      displayName: 'Status',
      required: false,
      options: {
        options: [
          { label: 'Queued', value: 'queued' },
          { label: 'Dispatched', value: 'dispatched' },
          { label: 'Sent', value: 'sent' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Failed', value: 'failed' },
          { label: 'Cancelled', value: 'cancelled' },
        ],
      },
    }),
    phone: smsGoraProps.phone,
    since: smsGoraProps.since,
    limit: smsGoraProps.limit,
  },
  async run(context) {
    const { direction, status, phone, since, limit } = context.propsValue;
    return smsGoraApi.call({
      apiKey: context.auth.secret_text,
      method: HttpMethod.GET,
      path: '/messages',
      query: smsGoraApi.cleanQuery({
        direction,
        status,
        phone,
        since: since ? new Date(since).toISOString() : undefined,
        limit,
      }),
    });
  },
});
