import CRUDServiceBase from '@common/services/CRUDServiceBase';
import ToDoDataAccessor from '@tools/services/ToDoDataAccessor';
import { ToDoData } from '@tools/interfaces/ToDoData';
import { ToDoRecord } from '@tools/interfaces/ToDoRecord';

/**
 * ToDoService
 * Business logic layer for ToDo items
 * Extends CRUDServiceBase to provide CRUD operations with data transformation
 */
export default class ToDoService extends CRUDServiceBase<ToDoData, ToDoRecord> {
  private readonly accessor: ToDoDataAccessor;

  /**
   * Constructor
   * Initializes the service with ToDoDataAccessor
   * @param useCache - Whether to use caching (default: true)
   */
  constructor(useCache: boolean = true) {
    const accessor = new ToDoDataAccessor();
    super(accessor, useCache);
    this.accessor = accessor;
  }

  /**
   * Convert Data to Record (application layer to database layer)
   * @param data - ToDo data from application layer
   * @returns Partial ToDo record for DynamoDB
   */
  protected dataToRecord(data: Partial<ToDoData>): Partial<ToDoRecord> {
    return {
      TerminalID: data.terminalId,
      Title: data.title,
      DueDate: data.dueDate,
      Priority: data.priority,
    };
  }

  /**
   * Convert Record to Data (database layer to application layer)
   * @param record - ToDo record from DynamoDB
   * @returns ToDo data for application layer
   */
  protected recordToData(record: ToDoRecord): ToDoData {
    // Ensure required fields are present
    if (!record.ID) {
      throw new Error('Record ID is required but missing');
    }
    if (record.Create === null || record.Create === undefined) {
      throw new Error('Record Create timestamp is required but missing');
    }
    if (record.Update === null || record.Update === undefined) {
      throw new Error('Record Update timestamp is required but missing');
    }

    return {
      id: record.ID,
      terminalId: record.TerminalID,
      title: record.Title,
      dueDate: record.DueDate,
      priority: record.Priority,
      create: record.Create,
      update: record.Update,
    };
  }

  /**
   * Get ToDo items by TerminalID
   * Retrieves all ToDo items for a specific device/terminal
   * 
   * @param terminalId - The TerminalID to filter by
   * @returns Promise<ToDoData[]> - Array of ToDo data for the specified terminal
   */
  public async getByTerminalId(terminalId: string): Promise<ToDoData[]> {
    const records = await this.accessor.getByTerminalId(terminalId);
    return records.map(record => this.recordToData(record));
  }

  /**
   * Get ToDo items by DueDate
   * Retrieves all ToDo items with a specific due date
   * Used by batch notification processing to find todos due on a particular date
   * 
   * @param dueDate - The due date in YYYY-MM-DD format
   * @returns Promise<ToDoData[]> - Array of ToDo data with the specified due date
   */
  public async getByDueDate(dueDate: string): Promise<ToDoData[]> {
    const records = await this.accessor.getByDueDate(dueDate);
    return records.map(record => this.recordToData(record));
  }
}
