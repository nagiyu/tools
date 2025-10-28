import { NextRequest } from 'next/server';

import NotificationSettingAccessor from '@tools/accessors/NotificationSettingAccessor';
import { NotificationSettingRecord } from '@tools/interfaces/NotificationSettingRecord';
import APIUtil, { APIResponseOptions } from '@client-common/utils/APIUtil';
import {
  DEFAULT_NOTIFICATION_ENABLED,
  DEFAULT_NOTIFICATION_HOUR,
  DEFAULT_TIMEZONE,
  MIN_NOTIFICATION_HOUR,
  MAX_NOTIFICATION_HOUR,
} from '@tools/consts/NotificationSettingConsts';
import { ROOT_FEATURE, ToolsFeature } from '@tools/consts/ToolsConsts';
import { BadRequestError } from '@common/errors';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const options: APIResponseOptions = {
  rootFeature: ROOT_FEATURE,
  feature: ToolsFeature.TODO,
};

/**
 * Validate if a string is a valid UUID (v4 format)
 * @param uuid - The UUID string to validate
 * @returns true if valid UUID format, false otherwise
 */
function isValidUUID(uuid: string): boolean {
  return UUID_REGEX.test(uuid);
}

/**
 * GET /api/todo/notification
 * Retrieve notification settings for a specific terminal
 * 
 * Query Parameters:
 * - terminalId: string (required) - The TerminalID to filter by
 * 
 * Response:
 * {
 *   enabled: boolean;
 *   notificationHour: number;
 *   timezone: string;
 * }
 */
export async function GET(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const terminalId = searchParams.get('terminalId');

    // Validate terminalId
    if (!terminalId) {
      throw new BadRequestError('terminalId is required');
    }

    if (!isValidUUID(terminalId)) {
      throw new BadRequestError('Invalid terminalId format');
    }

    // Get notification settings for the specified terminal
    const accessor = new NotificationSettingAccessor();
    const setting = await accessor.getByTerminalId(terminalId);

    // If no settings exist, return defaults
    if (!setting) {
      return {
        enabled: DEFAULT_NOTIFICATION_ENABLED,
        notificationHour: DEFAULT_NOTIFICATION_HOUR,
        timezone: DEFAULT_TIMEZONE,
      };
    }

    return {
      enabled: setting.Enabled,
      notificationHour: setting.NotificationHour,
      timezone: setting.Timezone,
    };
  }, options);
}

/**
 * POST /api/todo/notification
 * Save notification settings
 * 
 * Request Body:
 * {
 *   terminalId: string;
 *   enabled: boolean;
 *   notificationHour: number;  // 0-23
 *   timezone?: string;         // 省略時はデフォルト "Asia/Tokyo"
 * }
 * 
 * Response:
 * {
 *   success: boolean
 * }
 */
export async function POST(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const body = await request.json();
    const { terminalId, enabled, notificationHour, timezone } = body;

    // Validate required fields
    if (!terminalId || enabled === undefined || notificationHour === undefined) {
      throw new BadRequestError('Missing required fields: terminalId, enabled, notificationHour');
    }

    // Validate terminalId format
    if (!isValidUUID(terminalId)) {
      throw new BadRequestError('Invalid terminalId format');
    }

    // Validate enabled is boolean
    if (typeof enabled !== 'boolean') {
      throw new BadRequestError('enabled must be a boolean');
    }

    // Validate notificationHour
    if (typeof notificationHour !== 'number' || !Number.isInteger(notificationHour)) {
      throw new BadRequestError('notificationHour must be an integer');
    }

    if (notificationHour < MIN_NOTIFICATION_HOUR || notificationHour > MAX_NOTIFICATION_HOUR) {
      throw new BadRequestError(`notificationHour must be between ${MIN_NOTIFICATION_HOUR} and ${MAX_NOTIFICATION_HOUR}`);
    }

    // Use default timezone if not provided
    const effectiveTimezone = timezone || DEFAULT_TIMEZONE;

    // Create or update notification settings
    const accessor = new NotificationSettingAccessor();
    const existingSetting = await accessor.getByTerminalId(terminalId);

    const settingData: Partial<NotificationSettingRecord> = {
      ID: terminalId,
      TerminalID: terminalId,
      Enabled: enabled,
      NotificationHour: notificationHour,
      Timezone: effectiveTimezone,
    };

    if (existingSetting) {
      // Update existing settings
      await accessor.update(terminalId, settingData);
    } else {
      // Create new settings
      await accessor.create(settingData);
    }

    return { success: true };
  }, options);
}
