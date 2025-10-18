import { ToDoRecord } from '@tools/interfaces/ToDoRecord';

/**
 * ToDoDataAccessorMock
 * Mock implementation of ToDoDataAccessor for testing purposes
 * Provides in-memory storage for ToDo records without requiring DynamoDB
 * 
 * This mock can be used in tests as a drop-in replacement for ToDoDataAccessor
 * by using jest.mock() to replace the actual implementation.
 */
export default class ToDoDataAccessorMock {
  private mockData: ToDoRecord[] = [];
  private tableName: string;
  private dataType: string;

  constructor() {
    this.tableName = 'DevTools';
    this.dataType = 'ToDo';
  }

  /**
   * Get table name
   */
  public getTableName(): string {
    return this.tableName;
  }

  /**
   * Get data type
   */
  public getDataType(): string {
    return this.dataType;
  }

  /**
   * Get all ToDo records
   */
  public async get(): Promise<ToDoRecord[]> {
    return this.mockData.filter(record => record.DataType === 'ToDo');
  }

  /**
   * Get ToDo record by ID
   */
  public async getById(id: string): Promise<ToDoRecord | null> {
    const record = this.mockData.find(r => r.ID === id && r.DataType === 'ToDo');
    return record || null;
  }

  /**
   * Create a new ToDo record
   */
  public async create(creates: Partial<ToDoRecord>): Promise<ToDoRecord> {
    const now = Date.now();
    const newRecord: ToDoRecord = {
      ...creates,
      ID: this.generateMockId(),
      DataType: 'ToDo',
      TerminalID: creates.TerminalID || '',
      Title: creates.Title || '',
      DueDate: creates.DueDate || '',
      Priority: creates.Priority || 'Must',
      Create: now,
      Update: now,
    } as ToDoRecord;
    this.mockData.push(newRecord);
    return newRecord;
  }

  /**
   * Update a ToDo record
   */
  public async update(id: string, updates: Partial<ToDoRecord>): Promise<ToDoRecord | null> {
    const index = this.mockData.findIndex(r => r.ID === id && r.DataType === 'ToDo');
    if (index === -1) {
      return null;
    }
    
    this.mockData[index] = {
      ...this.mockData[index],
      ...updates,
      Update: Date.now(),
    };
    
    return this.mockData[index];
  }

  /**
   * Delete a ToDo record
   */
  public async delete(id: string): Promise<void> {
    this.mockData = this.mockData.filter(r => !(r.ID === id && r.DataType === 'ToDo'));
  }

  /**
   * Get ToDo items by TerminalID
   */
  public async getByTerminalId(terminalId: string): Promise<ToDoRecord[]> {
    const allRecords = await this.get();
    return allRecords.filter(record => record.TerminalID === terminalId);
  }

  /**
   * Get ToDo items by DueDate
   */
  public async getByDueDate(dueDate: string): Promise<ToDoRecord[]> {
    const allRecords = await this.get();
    return allRecords.filter(record => record.DueDate === dueDate);
  }

  /**
   * Set mock data for testing
   * @param data - Array of ToDo records to use as mock data
   */
  public setMockData(data: ToDoRecord[]): void {
    this.mockData = [...data];
  }

  /**
   * Clear all mock data
   */
  public clearMockData(): void {
    this.mockData = [];
  }

  /**
   * Get current mock data (useful for debugging tests)
   */
  public getMockData(): ToDoRecord[] {
    return [...this.mockData];
  }

  /**
   * Generate a mock UUID for testing
   */
  private generateMockId(): string {
    return `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
