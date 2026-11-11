import { createAction } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { smsGoraAuth } from '../auth';
import { smsGoraApi } from '../common';

export const getAccountAction = createAction({
  auth: smsGoraAuth,
  name: 'get_account',
  classification: 'READ',
  displayName: 'Get Account',
  description: 'Get your SMS Gora plan, limits and usage.',
  audience: 'both',
  aiMetadata: {
    description:
      'Get the SMS Gora account plan, limits and current usage. Use it to check remaining quota before a large send. Read-only, safe to retry.',
    idempotent: true,
  },
  props: {
  },
  async run(context) {
    return smsGoraApi.call({ apiKey: context.auth.secret_text, method: HttpMethod.GET, path: '/account' });
  },
});
