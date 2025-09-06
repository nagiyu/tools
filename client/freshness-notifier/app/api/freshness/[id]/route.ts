import { NextRequest } from 'next/server';
import FreshnessNotifierService from '@freshness-notifier/services/FreshnessNotifierService';
import { FreshnessDataType } from '@freshness-notifier/interfaces/data/FreshnessDataType';
import APIUtil from '@client-common/utils/APIUtil';

const service = new FreshnessNotifierService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const freshness = await service.getFreshnessById(id);
    if (!freshness) {
      return APIUtil.ReturnNotFound('Freshness item not found');
    }
    return APIUtil.ReturnSuccessWithObject({ data: freshness });
  } catch (error) {
    console.error('Error getting freshness item:', error);
    return APIUtil.ReturnInternalServerError({ error: 'Failed to get freshness item' });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const existingFreshness = await service.getFreshnessById(id);
    
    if (!existingFreshness) {
      return APIUtil.ReturnNotFound('Freshness item not found');
    }

    const freshnessData: FreshnessDataType = {
      ...existingFreshness,
      name: body.name ?? existingFreshness.name,
      expiryDate: body.expiryDate ?? existingFreshness.expiryDate,
      notificationEnabled: body.notificationEnabled ?? existingFreshness.notificationEnabled,
      update: Date.now(),
    };

    await service.updateFreshness(freshnessData);
    return APIUtil.ReturnSuccessWithObject({ data: freshnessData });
  } catch (error) {
    console.error('Error updating freshness item:', error);
    return APIUtil.ReturnInternalServerError({ error: 'Failed to update freshness item' });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingFreshness = await service.getFreshnessById(id);
    
    if (!existingFreshness) {
      return APIUtil.ReturnNotFound('Freshness item not found');
    }

    await service.deleteFreshness(id);
    return APIUtil.ReturnSuccess();
  } catch (error) {
    console.error('Error deleting freshness item:', error);
    return APIUtil.ReturnInternalServerError({ error: 'Failed to delete freshness item' });
  }
}