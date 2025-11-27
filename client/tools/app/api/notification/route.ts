import { NextRequest } from 'next/server';

import SecretsManagerUtil from '@common/aws/SecretsManagerUtil';
import APIUtil, { APIResponseOptions } from '@client-common/utils/APIUtil';
import { ROOT_FEATURE, ToolsFeature } from '@tools/consts/ToolsConsts';

const options: APIResponseOptions = {
  rootFeature: ROOT_FEATURE,
  feature: ToolsFeature.TODO,
};

/**
 * GET /api/notification
 * Retrieve VAPID public key for push notification subscription
 * 
 * Response:
 * {
 *   VAPID_PUBLIC_KEY: string;
 * }
 */
export async function GET(_request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const VAPID_PUBLIC_KEY = await SecretsManagerUtil.getSecretValue(
      process.env.PROJECT_SECRET!,
      'VAPID_PUBLIC_KEY'
    );

    return {
      VAPID_PUBLIC_KEY,
    };
  }, options);
}
