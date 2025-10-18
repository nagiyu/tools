import { NextRequest } from 'next/server';

import ToDoService from '@tools/services/ToDoService';
import { ToDoData } from '@tools/interfaces/ToDoData';
import APIUtil from '@client-common/utils/APIUtil';
import IdentifierUtil from '@common/utils/IdentifierUtil.server';

/**
 * GET /api/todo
 * Retrieve ToDo list for a specific terminal
 * 
 * Query Parameters:
 * - terminalId: string (required) - The TerminalID to filter by
 * 
 * Response:
 * {
 *   todos: ToDoData[]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const terminalId = searchParams.get('terminalId');

    // Validate terminalId
    if (!terminalId) {
      return APIUtil.ReturnBadRequest('terminalId is required');
    }

    if (!IdentifierUtil.validateTerminalId(terminalId)) {
      return APIUtil.ReturnBadRequest('Invalid terminalId format');
    }

    // Get todos for the specified terminal
    const service = new ToDoService();
    const todos = await service.getByTerminalId(terminalId);

    return APIUtil.ReturnSuccessWithObject({ todos });
  } catch (error) {
    console.error('Error in GET /api/todo:', error);
    return APIUtil.ReturnInternalServerErrorWithError(error);
  }
}

/**
 * POST /api/todo
 * Create a new ToDo item
 * 
 * Request Body:
 * {
 *   terminalId: string;
 *   title: string;
 *   dueDate: string;
 *   priority: PriorityType; // 'Must' | 'Should' | 'Could'
 * }
 * 
 * Response:
 * {
 *   todo: ToDoData
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { terminalId, title, dueDate, priority } = body;

    // Validate required fields
    if (!terminalId || !title || !dueDate || !priority) {
      return APIUtil.ReturnBadRequest('Missing required fields: terminalId, title, dueDate, priority');
    }

    // Validate terminalId format
    if (!IdentifierUtil.validateTerminalId(terminalId)) {
      return APIUtil.ReturnBadRequest('Invalid terminalId format');
    }

    // Validate priority
    const validPriorities = ['Must', 'Should', 'Could'];
    if (!validPriorities.includes(priority)) {
      return APIUtil.ReturnBadRequest('Invalid priority. Must be one of: Must, Should, Could');
    }

    // Validate dueDate format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dueDate)) {
      return APIUtil.ReturnBadRequest('Invalid dueDate format. Expected YYYY-MM-DD');
    }

    // Create new todo
    const service = new ToDoService();
    const newTodo: Partial<ToDoData> = {
      terminalId,
      title,
      dueDate,
      priority,
    };

    const todo = await service.create(newTodo);

    return APIUtil.ReturnSuccessWithObject({ todo });
  } catch (error) {
    console.error('Error in POST /api/todo:', error);
    return APIUtil.ReturnInternalServerErrorWithError(error);
  }
}

/**
 * PUT /api/todo
 * Update an existing ToDo item
 * 
 * Request Body:
 * {
 *   id: string;
 *   terminalId: string;
 *   title: string;
 *   dueDate: string;
 *   priority: PriorityType; // 'Must' | 'Should' | 'Could'
 * }
 * 
 * Response:
 * {
 *   todo: ToDoData
 * }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, terminalId, title, dueDate, priority } = body;

    // Validate required fields
    if (!id || !terminalId || !title || !dueDate || !priority) {
      return APIUtil.ReturnBadRequest('Missing required fields: id, terminalId, title, dueDate, priority');
    }

    // Validate terminalId format
    if (!IdentifierUtil.validateTerminalId(terminalId)) {
      return APIUtil.ReturnBadRequest('Invalid terminalId format');
    }

    // Validate priority
    const validPriorities = ['Must', 'Should', 'Could'];
    if (!validPriorities.includes(priority)) {
      return APIUtil.ReturnBadRequest('Invalid priority. Must be one of: Must, Should, Could');
    }

    // Validate dueDate format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dueDate)) {
      return APIUtil.ReturnBadRequest('Invalid dueDate format. Expected YYYY-MM-DD');
    }

    // Check if todo exists and belongs to the specified terminal
    const service = new ToDoService();
    const existingTodo = await service.getById(id);
    
    if (!existingTodo) {
      return APIUtil.ReturnNotFound('ToDo not found');
    }

    if (existingTodo.terminalId !== terminalId) {
      return APIUtil.ReturnBadRequest('TerminalID mismatch. Cannot update ToDo from different terminal');
    }

    // Update todo
    const updates: Partial<ToDoData> = {
      terminalId,
      title,
      dueDate,
      priority,
    };

    const todo = await service.update(id, updates);

    return APIUtil.ReturnSuccessWithObject({ todo });
  } catch (error) {
    console.error('Error in PUT /api/todo:', error);
    return APIUtil.ReturnInternalServerErrorWithError(error);
  }
}

/**
 * DELETE /api/todo
 * Delete a ToDo item
 * 
 * Request Body:
 * {
 *   id: string;
 *   terminalId: string;
 * }
 * 
 * Response:
 * {
 *   success: boolean
 * }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, terminalId } = body;

    // Validate required fields
    if (!id || !terminalId) {
      return APIUtil.ReturnBadRequest('Missing required fields: id, terminalId');
    }

    // Validate terminalId format
    if (!IdentifierUtil.validateTerminalId(terminalId)) {
      return APIUtil.ReturnBadRequest('Invalid terminalId format');
    }

    // Check if todo exists and belongs to the specified terminal
    const service = new ToDoService();
    const existingTodo = await service.getById(id);
    
    if (!existingTodo) {
      return APIUtil.ReturnNotFound('ToDo not found');
    }

    if (existingTodo.terminalId !== terminalId) {
      return APIUtil.ReturnBadRequest('TerminalID mismatch. Cannot delete ToDo from different terminal');
    }

    // Delete todo
    await service.delete(id);

    return APIUtil.ReturnSuccessWithObject({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/todo:', error);
    return APIUtil.ReturnInternalServerErrorWithError(error);
  }
}
