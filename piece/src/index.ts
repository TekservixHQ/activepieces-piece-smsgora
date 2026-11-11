import { createPiece, PieceCategory } from '@activepieces/pieces-framework';
import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { smsGoraAuth } from './lib/auth';
import { BASE_URL } from './lib/common';
import { sendSmsAction } from './lib/actions/send-sms';
import { sendBulkSmsAction } from './lib/actions/send-bulk-sms';
import { getMessageAction } from './lib/actions/get-message';
import { cancelMessageAction } from './lib/actions/cancel-message';
import { findMessagesAction } from './lib/actions/find-messages';
import { findReceivedSmsAction } from './lib/actions/find-received-sms';
import { getPhoneAction } from './lib/actions/get-phone';
import { listPhonesAction } from './lib/actions/list-phones';
import { getAccountAction } from './lib/actions/get-account';
import { newSmsEventTrigger } from './lib/triggers/new-sms-event';

export const smsGora = createPiece({
  displayName: 'SMS Gora',
  description: 'Send and receive SMS through your own Android phones with the SMS Gora SMS gateway by Tekservix.',
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.jsdelivr.net/gh/TekservixHQ/activepieces-piece-smsgora@main/logo.png',
  categories: [PieceCategory.COMMUNICATION, PieceCategory.MARKETING],
  auth: smsGoraAuth,
  authors: ['TekservixHQ'],
  actions: [
    sendSmsAction,
    sendBulkSmsAction,
    getMessageAction,
    cancelMessageAction,
    findMessagesAction,
    findReceivedSmsAction,
    getPhoneAction,
    listPhonesAction,
    getAccountAction,
    createCustomApiCallAction({
      baseUrl: () => BASE_URL,
      auth: smsGoraAuth,
      authMapping: async (auth) => ({ 'x-api-key': auth.secret_text }),
    }),
  ],
  triggers: [newSmsEventTrigger],
});
