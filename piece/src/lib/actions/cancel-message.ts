import { createAction } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { smsGoraAuth } from '../auth';
import { smsGoraApi } from '../common';
import { smsGoraProps } from '../common/props';

export const cancelMessageAction = createAction({
  auth: smsGoraAuth,
  name: 'cancel_message',
  classification: 'DESTRUCTIVE',
  displayName: 'Cancel Message',
  description: 'Cancel a message that is still queued or scheduled.',
  audience: 'both',
  aiMetadata: {
    description:
      'Cancel an SMS that has not left the phone yet (queued or scheduled). Messages already sent cannot be cancelled. A repeat call on the same message fails.',
    idempotent: false,
  },
  props: {
    message_id: smsGoraProps.messageId,
  },
  async run(context) {
cancel-message0
  },
});
