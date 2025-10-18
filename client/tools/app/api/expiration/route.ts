import { NextRequest } from 'next/server';

import ExpirationService from '@tools/services/ExpirationService';
import { ExpirationData } from '@tools/types/ExpirationTypes';
import APIUtil from '@client-common/utils/APIUtil';

/**
 * GET /api/expiration
 * Retrieve all expiration data for the user's TerminalID
 */
export async function GET(request: NextRequest) {
  try {
    // Get TerminalID from request headers (set by client)
    const terminalId = request.headers.get('x-terminal-id');
    
    if (!terminalId) {
      return APIUtil.ReturnBadRequest('TerminalID is required');
    }

    const service = new ExpirationService();
    const allData = await service.get();
    
    // Filter by TerminalID
    const expirations = allData.filter(item => item.terminalId === terminalId);
    
    return APIUtil.ReturnSuccessWithObject({ expirations });
  } catch (error) {
    console.error('Error in GET /api/expiration:', error);
    return APIUtil.ReturnInternalServerErrorWithError(error);
  }
}

/**
 * POST /api/expiration
 * Create a new expiration record
 */
export async function POST(request: NextRequest) {
  try {
    const terminalId = request.headers.get('x-terminal-id');
    
    if (!terminalId) {
      return APIUtil.ReturnBadRequest('TerminalID is required');
    }

    const body = await request.json();
    const { title, expirationDate, memo } = body;

    if (!title || !expirationDate) {
      return APIUtil.ReturnBadRequest('Title and expirationDate are required');
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
    
    return APIUtil.ReturnSuccessWithObject({ expiration });
  } catch (error) {
    console.error('Error in POST /api/expiration:', error);
    return APIUtil.ReturnInternalServerErrorWithError(error);
  }
}

/**
 * PUT /api/expiration
 * Update an existing expiration record
 */
export async function PUT(request: NextRequest) {
  try {
    const terminalId = request.headers.get('x-terminal-id');
    
    if (!terminalId) {
      return APIUtil.ReturnBadRequest('TerminalID is required');
    }

    const body = await request.json();
    const { id, title, expirationDate, memo } = body;

    if (!id) {
      return APIUtil.ReturnBadRequest('ID is required');
    }

    const service = new ExpirationService();
    
    // Verify the item belongs to this terminal
    const existing = await service.getById(id);
    if (!existing || existing.terminalId !== terminalId) {
      return APIUtil.ReturnNotFound('Expiration not found');
    }

    const updates: Partial<ExpirationData> = {
      update: Date.now(),
    };

    if (title !== undefined) updates.title = title;
    if (expirationDate !== undefined) updates.expirationDate = expirationDate;
    if (memo !== undefined) updates.memo = memo;

    const expiration = await service.update(id, updates);
    
    return APIUtil.ReturnSuccessWithObject({ expiration });
  } catch (error) {
    console.error('Error in PUT /api/expiration:', error);
    return APIUtil.ReturnInternalServerErrorWithError(error);
  }
}

/**
 * DELETE /api/expiration
 * Delete an expiration record
 */
export async function DELETE(request: NextRequest) {
  try {
    const terminalId = request.headers.get('x-terminal-id');
    
    if (!terminalId) {
      return APIUtil.ReturnBadRequest('TerminalID is required');
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return APIUtil.ReturnBadRequest('ID is required');
    }

    const service = new ExpirationService();
    
    // Verify the item belongs to this terminal
    const existing = await service.getById(id);
    if (!existing || existing.terminalId !== terminalId) {
      return APIUtil.ReturnNotFound('Expiration not found');
    }

    await service.delete(id);
    
    return APIUtil.ReturnSuccessWithObject({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/expiration:', error);
    return APIUtil.ReturnInternalServerErrorWithError(error);
  }
}
