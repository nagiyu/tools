import { NextRequest } from 'next/server';
import FreshnessNotifierService from '@freshness-notifier/services/FreshnessNotifierService';
import { FreshnessDataType } from '@freshness-notifier/interfaces/data/FreshnessDataType';
import CommonUtil from '@common/utils/CommonUtil';
import APIUtil from '@client-common/utils/APIUtil';

const service = new FreshnessNotifierService();

export async function GET() {
  try {
    const freshness = await service.getFreshness();
    return APIUtil.ReturnSuccessWithObject({ data: freshness });
  } catch (error) {
    console.error('Error getting freshness items:', error);
    return APIUtil.ReturnInternalServerError({ error: 'Failed to get freshness items' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const freshnessData: FreshnessDataType = {
      id: CommonUtil.generateUUID(),
      name: body.name,
      expiryDate: body.expiryDate,
      notificationEnabled: body.notificationEnabled ?? true,
      create: Date.now(),
      update: Date.now(),
    };

    await service.createFreshness(freshnessData);
    return APIUtil.ReturnSuccessWithObject({ data: freshnessData });
  } catch (error) {
    console.error('Error creating freshness item:', error);
    return APIUtil.ReturnInternalServerError({ error: 'Failed to create freshness item' });
  }
}