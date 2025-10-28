import { NextRequest } from 'next/server';

import { BadRequestError, NotFoundError } from '@common/errors';

import APIUtil, { APIResponseOptions } from '@client-common/utils/APIUtil';

import ExpirationSettingsService from '@tools/services/ExpirationSettingsService';
import { ExpirationSettingsData } from '@tools/types/ExpirationTypes';
import { ROOT_FEATURE, ToolsFeature } from '@tools/consts/ToolsConsts';

const DEFAULT_NOTIFICATION_HOUR = 9;
const DEFAULT_DAYS_BEFORE_NOTIFY = 3;

const options: APIResponseOptions = {
  rootFeature: ROOT_FEATURE,
  feature: ToolsFeature.EXPIRATION,
};

/**
 * GET /api/expiration/settings
 * Retrieve settings for the user's TerminalID
 */
export async function GET(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const terminalId = searchParams.get('terminalId');

    if (!terminalId) {
      throw new BadRequestError('terminalId is required');
    }

    const service = new ExpirationSettingsService();
    const allSettings = await service.get();

    // Find settings for this terminal
    const settings = allSettings.find(s => s.terminalId === terminalId);

    // If no settings exist, return default settings
    if (!settings) {
      const defaultSettings: ExpirationSettingsData = {
        id: '',
        terminalId,
        notificationHour: DEFAULT_NOTIFICATION_HOUR,
        daysBeforeNotify: DEFAULT_DAYS_BEFORE_NOTIFY,
        create: 0,
        update: 0,
      };
      return { settings: defaultSettings };
    }

    return { settings };
  }, options);
}

/**
 * PUT /api/expiration/settings
 * Update or create settings for the user's TerminalID
 */
export async function PUT(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const body = await request.json();
    const { terminalId, notificationHour, daysBeforeNotify } = body;

    if (!terminalId) {
      throw new BadRequestError('terminalId is required');
    }

    // Validate notificationHour
    if (notificationHour !== undefined && (notificationHour < 0 || notificationHour > 23)) {
      throw new BadRequestError('notificationHour must be between 0 and 23');
    }

    // Validate daysBeforeNotify
    if (daysBeforeNotify !== undefined && daysBeforeNotify < 0) {
      throw new BadRequestError('daysBeforeNotify must be non-negative');
    }

    const service = new ExpirationSettingsService();
    const allSettings = await service.get();

    // Find existing settings for this terminal
    const existingSettings = allSettings.find(s => s.terminalId === terminalId);

    let settings: ExpirationSettingsData;

    if (existingSettings) {
      // Update existing settings
      const updates: Partial<ExpirationSettingsData> = {
        update: Date.now(),
      };

      if (notificationHour !== undefined) updates.notificationHour = notificationHour;
      if (daysBeforeNotify !== undefined) updates.daysBeforeNotify = daysBeforeNotify;

      settings = await service.update(existingSettings.id, updates);
    } else {
      // Create new settings
      const now = Date.now();
      const newSettings: Partial<ExpirationSettingsData> = {
        terminalId,
        notificationHour: notificationHour !== undefined ? notificationHour : DEFAULT_NOTIFICATION_HOUR,
        daysBeforeNotify: daysBeforeNotify !== undefined ? daysBeforeNotify : DEFAULT_DAYS_BEFORE_NOTIFY,
        create: now,
        update: now,
      };

      settings = await service.create(newSettings);
    }

    return { settings };
  }, options);
}

/**
 * DELETE /api/expiration/settings
 * Delete settings for the user's TerminalID
 */
export async function DELETE(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const terminalId = searchParams.get('terminalId');

    if (!terminalId) {
      throw new BadRequestError('terminalId is required');
    }

    const service = new ExpirationSettingsService();
    const allSettings = await service.get();

    // Find settings for this terminal
    const settings = allSettings.find(s => s.terminalId === terminalId);

    if (!settings) {
      throw new NotFoundError('Settings not found');
    }

    await service.delete(settings.id);

    return { success: true };
  }, options);
}
