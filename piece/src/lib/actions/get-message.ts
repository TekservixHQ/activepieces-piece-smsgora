import { createAction } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { smsGoraAuth } from '../auth';
import { smsGoraApi } from '../common';
import { smsGoraProps } from '../common/props';

export const getMessageAction = createAction({
  auth: smsGoraAuth,
  name: 'get_message',
  classification: 'READ',
  displayName: 'Get Message',
  description: 'Get one message and its delivery status.',
  audience: 'both',
  aiMetadata: {
    description:
      'Look up one SMS by its message ID to see its status (queued, sent, delivered, failed or cancelled), timestamps and error. Use after Send SMS to confirm delivery. Read-only, safe to retry.',
    idempotent: true,
  },
  props: {
    message_id: smsGoraProps.messageId,
  },
  async run(context) {
get-message0
  },
});
