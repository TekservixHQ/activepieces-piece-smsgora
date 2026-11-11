import { PieceAuth } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { smsGoraApi } from './common';

export const smsGoraAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: `You need a Tekservix account with SMS Gora and at least one Android phone linked.

1. Sign in at https://tekservix.com and open **SMS Gora → API keys**.
2. Click **Create key** and copy it (it starts with \`sgk_\`).
3. Paste it here.

No account yet? Start at https://tekservix.com/smsgora`,
  required: true,
  validate: async ({ auth }) => {
    const result = await smsGoraApi
      .call({ apiKey: auth, method: HttpMethod.GET, path: '/account' })
      .then(() => ({ valid: true as const }))
      .catch(() => ({ valid: false as const, error: 'This API key was not accepted by SMS Gora.' }));
    return result;
  },
});
