import { NextRequest } from 'next/server';

import ExpirationSettingsService from '@tools/services/ExpirationSettingsService';
import { ExpirationSettingsData } from '@tools/types/ExpirationTypes';
import APIUtil from '@client-common/utils/APIUtil';

const DEFAULT_NOTIFICATION_HOUR = 9;
const DEFAULT_DAYS_BEFORE_NOTIFY = 3;

/**
 * GET /api/expiration/settings
 * Retrieve settings for the user's TerminalID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const terminalId = searchParams.get('terminalId');
    
    if (!terminalId) {
      return APIUtil.ReturnBadRequest('terminalId is required');
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
      return APIUtil.ReturnSuccessWithObject({ settings: defaultSettings });
    }
    
    return APIUtil.ReturnSuccessWithObject({ settings });
  } catch (error) {
    console.error('Error in GET /api/expiration/settings:', error);
    return APIUtil.ReturnInternalServerErrorWithError(error);
  }
}

/**
 * PUT /api/expiration/settings
 * Update or create settings for the user's TerminalID
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { terminalId, notificationHour, daysBeforeNotify } = body;
    
    if (!terminalId) {
      return APIUtil.ReturnBadRequest('terminalId is required');
    }

    // Validate notificationHour
    if (notificationHour !== undefined && (notificationHour < 0 || notificationHour > 23)) {
      return APIUtil.ReturnBadRequest('notificationHour must be between 0 and 23');
    }

    // Validate daysBeforeNotify
    if (daysBeforeNotify !== undefined && daysBeforeNotify < 0) {
      return APIUtil.ReturnBadRequest('daysBeforeNotify must be non-negative');
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
    
    return APIUtil.ReturnSuccessWithObject({ settings });
  } catch (error) {
    console.error('Error in PUT /api/expiration/settings:', error);
    return APIUtil.ReturnInternalServerErrorWithError(error);
  }
}

/**
 * DELETE /api/expiration/settings
 * Delete settings for the user's TerminalID
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const terminalId = searchParams.get('terminalId');
    
    if (!terminalId) {
      return APIUtil.ReturnBadRequest('terminalId is required');
    }

    const service = new ExpirationSettingsService();
    const allSettings = await service.get();
    
    // Find settings for this terminal
    const settings = allSettings.find(s => s.terminalId === terminalId);
    
    if (!settings) {
      return APIUtil.ReturnNotFound('Settings not found');
    }

    await service.delete(settings.id);
    
    return APIUtil.ReturnSuccessWithObject({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/expiration/settings:', error);
    return APIUtil.ReturnInternalServerErrorWithError(error);
  }
}
