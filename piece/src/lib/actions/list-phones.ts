import { createAction } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { smsGoraAuth } from '../auth';
import { smsGoraApi } from '../common';

export const listPhonesAction = createAction({
  auth: smsGoraAuth,
  name: 'list_phones',
  classification: 'SEARCH',
  displayName: 'List Phones',
  description: 'List all Android phones linked to your account.',
  audience: 'both',
  aiMetadata: {
    description:
      'List every Android phone linked to the SMS Gora account with its ID and online status. Use it to pick a sending phone or check that one is online. Read-only, safe to retry.',
    idempotent: true,
  },
  props: {
  },
  async run(context) {
list-phones0
  },
});
