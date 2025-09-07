import { NextRequest } from 'next/server';
import FreshnessNotifierService from '@freshness-notifier/services/FreshnessNotifierService';
import { SettingDataType } from '@freshness-notifier/interfaces/data/SettingDataType';
import APIUtil from '@client-common/utils/APIUtil';

const service = new FreshnessNotifierService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const setting = await service.getSettingById(id);
    if (!setting) {
      return APIUtil.ReturnNotFound('Setting not found');
    }
    return APIUtil.ReturnSuccessWithObject({ data: setting });
  } catch (error) {
    console.error('Error getting setting:', error);
    return APIUtil.ReturnInternalServerError({ error: 'Failed to get setting' });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const existingSetting = await service.getSettingById(id);
    
    if (!existingSetting) {
      return APIUtil.ReturnNotFound('Setting not found');
    }

    const settingData: SettingDataType = {
      ...existingSetting,
      terminalId: body.terminalId ?? existingSetting.terminalId,
      subscriptionEndpoint: body.subscriptionEndpoint ?? existingSetting.subscriptionEndpoint,
      subscriptionKeysP256dh: body.subscriptionKeysP256dh ?? existingSetting.subscriptionKeysP256dh,
      subscriptionKeysAuth: body.subscriptionKeysAuth ?? existingSetting.subscriptionKeysAuth,
      notificationEnabled: body.notificationEnabled ?? existingSetting.notificationEnabled,
      notificationTime: body.notificationTime ?? existingSetting.notificationTime,
      update: Date.now(),
    };

    await service.updateSetting(settingData);
    return APIUtil.ReturnSuccessWithObject({ data: settingData });
  } catch (error) {
    console.error('Error updating setting:', error);
    return APIUtil.ReturnInternalServerError({ error: 'Failed to update setting' });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingSetting = await service.getSettingById(id);
    
    if (!existingSetting) {
      return APIUtil.ReturnNotFound('Setting not found');
    }

    await service.deleteSetting(id);
    return APIUtil.ReturnSuccess();
  } catch (error) {
    console.error('Error deleting setting:', error);
    return APIUtil.ReturnInternalServerError({ error: 'Failed to delete setting' });
  }
}