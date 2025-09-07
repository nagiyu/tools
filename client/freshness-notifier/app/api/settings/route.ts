import { NextRequest } from 'next/server';
import FreshnessNotifierService from '@freshness-notifier/services/FreshnessNotifierService';
import { SettingDataType } from '@freshness-notifier/interfaces/data/SettingDataType';
import CommonUtil from '@common/utils/CommonUtil';
import APIUtil from '@client-common/utils/APIUtil';

const service = new FreshnessNotifierService();

export async function GET() {
  try {
    const settings = await service.getSettings();
    return APIUtil.ReturnSuccessWithObject({ data: settings });
  } catch (error) {
    console.error('Error getting settings:', error);
    return APIUtil.ReturnInternalServerError({ error: 'Failed to get settings' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const settingData: SettingDataType = {
      id: CommonUtil.generateUUID(),
      terminalId: body.terminalId,
      subscriptionEndpoint: body.subscriptionEndpoint,
      subscriptionKeysP256dh: body.subscriptionKeysP256dh,
      subscriptionKeysAuth: body.subscriptionKeysAuth,
      notificationEnabled: body.notificationEnabled ?? true,
      notificationTime: body.notificationTime ?? 9, // Default to 9 AM
      create: Date.now(),
      update: Date.now(),
    };

    await service.createSetting(settingData);
    return APIUtil.ReturnSuccessWithObject({ data: settingData });
  } catch (error) {
    console.error('Error creating setting:', error);
    return APIUtil.ReturnInternalServerError({ error: 'Failed to create setting' });
  }
}