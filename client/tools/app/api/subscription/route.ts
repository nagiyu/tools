import { NextRequest } from 'next/server';

import { SubscriptionService } from '@common/services/subscription/SubscriptionService';
import { SubscriptionDataType } from '@common/interfaces/data/SubscriptionDataType';
import APIUtil, { APIResponseOptions } from '@client-common/utils/APIUtil';
import { BadRequestError, NotFoundError } from '@common/errors';
import { ROOT_FEATURE, ToolsFeature } from '@tools/consts/ToolsConsts';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const options: APIResponseOptions = {
  rootFeature: ROOT_FEATURE,
  feature: ToolsFeature.TODO,
};

/**
 * Validate if a string is a valid UUID format
 * @param uuid - The UUID string to validate
 * @returns true if valid UUID format, false otherwise
 */
function isValidUUID(uuid: string): boolean {
  return UUID_REGEX.test(uuid);
}

/**
 * GET /api/subscription
 * Retrieve a subscription by terminalId
 * 
 * Query Parameters:
 * - terminalId: string (required) - The TerminalID to filter by
 * 
 * Response:
 * SubscriptionDataType or 404 if not found
 */
export async function GET(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const terminalId = searchParams.get('terminalId');

    if (!terminalId) {
      throw new BadRequestError('terminalId is required');
    }

    if (!isValidUUID(terminalId)) {
      throw new BadRequestError('Invalid terminalId format');
    }

    const subscriptionService = new SubscriptionService();
    
    try {
      const subscription = await subscriptionService.getByTerminalId(terminalId);
      return subscription;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError('Subscription not found');
      }
      throw error;
    }
  }, options);
}

/**
 * POST /api/subscription
 * Create a new subscription
 * 
 * Request Body:
 * {
 *   terminalId: string;
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
 * SubscriptionDataType
 */
export async function POST(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const body = await request.json();
    const { terminalId, subscription } = body;

    if (!terminalId || !subscription) {
      throw new BadRequestError('terminalId and subscription are required');
    }

    if (!isValidUUID(terminalId)) {
      throw new BadRequestError('Invalid terminalId format');
    }

    if (!subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
      throw new BadRequestError('Invalid subscription format');
    }

    const subscriptionService = new SubscriptionService();
    const subscriptionData: Partial<SubscriptionDataType> = {
      terminalId,
      subscription,
    };

    const createdSubscription = await subscriptionService.create(subscriptionData);
    return createdSubscription;
  }, options);
}

/**
 * PUT /api/subscription
 * Update an existing subscription
 * 
 * Query Parameters:
 * - id: string (required) - The subscription ID
 * 
 * Request Body:
 * {
 *   terminalId?: string;
 *   subscription?: {
 *     endpoint: string;
 *     keys: {
 *       p256dh: string;
 *       auth: string;
 *     };
 *   };
 * }
 * 
 * Response:
 * SubscriptionDataType
 */
export async function PUT(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new BadRequestError('id is required');
    }

    if (!isValidUUID(id)) {
      throw new BadRequestError('Invalid id format');
    }

    const body = await request.json();
    const { terminalId, subscription } = body;

    if (terminalId && !isValidUUID(terminalId)) {
      throw new BadRequestError('Invalid terminalId format');
    }

    if (subscription && (!subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth)) {
      throw new BadRequestError('Invalid subscription format');
    }

    const subscriptionService = new SubscriptionService();
    const subscriptionData: Partial<SubscriptionDataType> = {};

    if (terminalId) {
      subscriptionData.terminalId = terminalId;
    }

    if (subscription) {
      subscriptionData.subscription = subscription;
    }

    const updatedSubscription = await subscriptionService.update(id, subscriptionData);
    return updatedSubscription;
  }, options);
}

/**
 * DELETE /api/subscription
 * Delete a subscription
 * 
 * Query Parameters:
 * - id: string (required) - The subscription ID
 * 
 * Response:
 * { success: true }
 */
export async function DELETE(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new BadRequestError('id is required');
    }

    if (!isValidUUID(id)) {
      throw new BadRequestError('Invalid id format');
    }

    const subscriptionService = new SubscriptionService();
    await subscriptionService.delete(id);

    return { success: true };
  }, options);
}
