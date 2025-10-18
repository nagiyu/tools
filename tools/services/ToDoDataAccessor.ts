import DataAccessorBase from '@common/services/DataAccessorBase';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';
import { ToDoRecord } from '@tools/interfaces/ToDoRecord';

/**
 * ToDoDataAccessor
 * Data access layer for ToDo items in DynamoDB
 * Extends DataAccessorBase to provide CRUD operations and custom queries
 */
export default class ToDoDataAccessor extends DataAccessorBase<ToDoRecord> {
  /**
   * Constructor
   * Initializes the data accessor with the appropriate table name and data type
   */
  constructor() {
    super(ToDoDataAccessor.getTableName(), 'ToDo');
  }

  /**
   * Get table name based on environment
   * @returns Table name string
   */
  private static getTableName(): string {
    switch (EnvironmentalUtil.GetProcessEnv()) {
      case 'production':
        return 'Tools';
      case 'development':
      case 'local':
      default:
        return 'DevTools';
    }
  }

  /**
   * Get ToDo items by TerminalID
   * Retrieves all ToDo items for a specific device/terminal
   * 
   * @param terminalId - The TerminalID to filter by
   * @returns Promise<ToDoRecord[]> - Array of ToDo records for the specified terminal
   */
  public async getByTerminalId(terminalId: string): Promise<ToDoRecord[]> {
    const allRecords = await this.get();
    return allRecords.filter(record => record.TerminalID === terminalId);
  }

  /**
   * Get ToDo items by DueDate
   * Retrieves all ToDo items with a specific due date
   * Used by batch notification processing to find todos due on a particular date
   * 
   * @param dueDate - The due date in YYYY-MM-DD format
   * @returns Promise<ToDoRecord[]> - Array of ToDo records with the specified due date
   */
  public async getByDueDate(dueDate: string): Promise<ToDoRecord[]> {
    const allRecords = await this.get();
    return allRecords.filter(record => record.DueDate === dueDate);
  }
}
