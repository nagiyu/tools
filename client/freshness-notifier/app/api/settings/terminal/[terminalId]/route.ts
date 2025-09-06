import { NextRequest } from 'next/server';
import FreshnessNotifierService from '@freshness-notifier/services/FreshnessNotifierService';
import APIUtil from '@client-common/utils/APIUtil';

const service = new FreshnessNotifierService();

export async function GET(
  request: NextRequest,
  { params }: { params: { terminalId: string } }
) {
  try {
    const setting = await service.getSettingByTerminalId(params.terminalId);
    if (!setting) {
      return APIUtil.ReturnNotFound('Setting not found for terminal');
    }
    return APIUtil.ReturnSuccessWithObject({ data: setting });
  } catch (error) {
    console.error('Error getting setting by terminal ID:', error);
    return APIUtil.ReturnInternalServerError({ error: 'Failed to get setting by terminal ID' });
  }
}