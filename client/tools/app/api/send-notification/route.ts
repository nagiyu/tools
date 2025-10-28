import { NextRequest } from 'next/server';

import NotificationUtil from '@client-common/utils/NotificationUtil.server';
import APIUtil, { APIResponseOptions } from '@client-common/utils/APIUtil';
import { BadRequestError } from '@common/errors';
import { ROOT_FEATURE, ToolsFeature } from '@tools/consts/ToolsConsts';

const options: APIResponseOptions = {
  rootFeature: ROOT_FEATURE,
  feature: ToolsFeature.TODO,
};

/**
 * POST /api/send-notification
 * Send a push notification to a subscribed client
 * 
 * Request Body:
 * {
 *   message: string;
 *   subscription: {
 *     endpoint: string;
 *     keys: {
 *       p256dh: string;
 *       auth: string;
 *     };
 *   };
 * }
 * 
 * Response:
 * { success: true }
 */
export async function POST(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const body = await request.json();
    const { message, subscription } = body;

    if (!message || !subscription) {
      throw new BadRequestError('message and subscription are required');
    }

    if (!subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
      throw new BadRequestError('Invalid subscription format');
    }

    const payload = {
      title: 'Test Notification',
      body: message,
      icon: '/logo.png',
    };

    await NotificationUtil.sendNotification(subscription, payload);

    return { success: true };
  }, options);
}
