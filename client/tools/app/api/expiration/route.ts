import { NextRequest } from 'next/server';

import { BadRequestError, NotFoundError } from '@common/errors';

import APIUtil, { APIResponseOptions } from '@client-common/utils/APIUtil';

import ExpirationService from '@tools/services/ExpirationService';
import { ExpirationData } from '@tools/types/ExpirationTypes';
import { ROOT_FEATURE, ToolsFeature } from '@tools/consts/ToolsConsts';

const options: APIResponseOptions = {
  rootFeature: ROOT_FEATURE,
  feature: ToolsFeature.EXPIRATION,
};

/**
 * GET /api/expiration
 * Retrieve all expiration data for the user's TerminalID
 */
export async function GET(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    // Get TerminalID from query parameters
    const { searchParams } = new URL(request.url);
    const terminalId = searchParams.get('terminalId');

    if (!terminalId) {
      throw new BadRequestError('terminalId is required');
    }

    const service = new ExpirationService();
    const allData = await service.get();

    // Filter by TerminalID
    const expirations = allData.filter(item => item.terminalId === terminalId);

    return { expirations };
  }, options);
}

/**
 * POST /api/expiration
 * Create a new expiration record
 */
export async function POST(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const body = await request.json();
    const { terminalId, title, expirationDate, memo } = body;

    if (!terminalId) {
      throw new BadRequestError('terminalId is required');
    }

    if (!title || !expirationDate) {
      throw new BadRequestError('title and expirationDate are required');
    }

    const service = new ExpirationService();
    const now = Date.now();

    const newExpiration: Partial<ExpirationData> = {
      terminalId,
      title,
      expirationDate,
      memo,
      create: now,
      update: now,
    };

    const expiration = await service.create(newExpiration);

    return { expiration };
  }, options);
}

/**
 * PUT /api/expiration
 * Update an existing expiration record
 */
export async function PUT(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const body = await request.json();
    const { terminalId, id, title, expirationDate, memo } = body;

    if (!terminalId) {
      throw new BadRequestError('terminalId is required');
    }

    if (!id) {
      throw new BadRequestError('id is required');
    }

    const service = new ExpirationService();

    // Verify the item belongs to this terminal
    const existing = await service.getById(id);
    if (!existing || existing.terminalId !== terminalId) {
      throw new NotFoundError('Expiration not found');
    }

    const updates: Partial<ExpirationData> = {
      update: Date.now(),
    };

    if (title !== undefined) updates.title = title;
    if (expirationDate !== undefined) updates.expirationDate = expirationDate;
    if (memo !== undefined) updates.memo = memo;

    const expiration = await service.update(id, updates);

    return { expiration };
  }, options);
}

/**
 * DELETE /api/expiration
 * Delete an expiration record
 */
export async function DELETE(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const terminalId = searchParams.get('terminalId');
    const id = searchParams.get('id');

    if (!terminalId) {
      throw new BadRequestError('terminalId is required');
    }

    if (!id) {
      throw new BadRequestError('id is required');
    }

    const service = new ExpirationService();

    // Verify the item belongs to this terminal
    const existing = await service.getById(id);
    if (!existing || existing.terminalId !== terminalId) {
      throw new NotFoundError('Expiration not found');
    }

    await service.delete(id);

    return { success: true };
  }, options);
}
