import { createAction } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { smsGoraAuth } from '../auth';
import { smsGoraApi } from '../common';
import { smsGoraProps } from '../common/props';

export const getPhoneAction = createAction({
  auth: smsGoraAuth,
  name: 'get_phone',
  classification: 'READ',
  displayName: 'Get Phone',
  description: 'Get one linked phone, its status and battery.',
  audience: 'both',
  aiMetadata: {
    description:
      'Get details of one Android phone linked to SMS Gora (online status, battery, SIMs). Use List Phones to see all of them. Read-only, safe to retry.',
    idempotent: true,
  },
  props: {
    device_id: smsGoraProps.device({ required: true, description: 'The phone to look up.' }),
  },
  async run(context) {
get-phone0
  },
});
