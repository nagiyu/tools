import { ToDoData } from '@tools/interfaces/ToDoData';
import { ToDoRecord } from '@tools/interfaces/ToDoRecord';

// Mock CacheUtil to avoid side effects
jest.mock('@common/utils/CacheUtil', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

// Mock DataAccessorBase to avoid AWS SDK dependencies
jest.mock('@common/services/DataAccessorBase', () => {
  return {
    __esModule: true,
    default: class DataAccessorBaseMock {
      async get(): Promise<any[]> {
        return [];
      }
      async getById(id: string): Promise<any | null> {
        return null;
      }
      async create(record: any): Promise<any> {
        return record;
      }
      async update(id: string, record: any): Promise<any> {
        return record;
      }
      async delete(id: string): Promise<void> {
        return;
      }
      getTableName(): string {
        return 'TestTable';
      }
      getDataType(): string {
        return 'TestType';
      }
    }
  };
});

// Mock EnvironmentalUtil
jest.mock('@common/utils/EnvironmentalUtil', () => ({
  __esModule: true,
  default: {
    GetProcessEnv: jest.fn().mockReturnValue('local'),
  },
}));

// Import after mocks
import ToDoService from '@tools/services/ToDoService';
import ToDoDataAccessor from '@tools/services/ToDoDataAccessor';

describe('ToDoService', () => {
  let service: ToDoService;
  let mockRecords: ToDoRecord[];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup mock data
    mockRecords = [
      {
        ID: 'todo-1',
        DataType: 'ToDo',
        TerminalID: 'terminal-111',
        Title: 'Complete project documentation',
        DueDate: '2024-10-20',
        Priority: 'Must',
        Create: 1697000000000,
        Update: 1697000000000,
      },
      {
        ID: 'todo-2',
        DataType: 'ToDo',
        TerminalID: 'terminal-111',
        Title: 'Review pull requests',
        DueDate: '2024-10-21',
        Priority: 'Should',
        Create: 1697000000000,
        Update: 1697000000000,
      },
      {
        ID: 'todo-3',
        DataType: 'ToDo',
        TerminalID: 'terminal-222',
        Title: 'Team meeting preparation',
        DueDate: '2024-10-20',
        Priority: 'Could',
        Create: 1697000000000,
        Update: 1697000000000,
      },
    ];

    // Create service instance
    service = new ToDoService(false); // Disable cache for testing

    // Get the accessor and mock its methods
    const accessor = (service as any).accessor as ToDoDataAccessor;
    
    // Mock accessor methods
    accessor.get = jest.fn().mockResolvedValue(mockRecords);
    accessor.getById = jest.fn().mockImplementation(async (id: string) => {
      return mockRecords.find(r => r.ID === id) || null;
    });
    accessor.getByTerminalId = jest.fn().mockImplementation(async (terminalId: string) => {
      return mockRecords.filter(r => r.TerminalID === terminalId);
    });
    accessor.getByDueDate = jest.fn().mockImplementation(async (dueDate: string) => {
      return mockRecords.filter(r => r.DueDate === dueDate);
    });
    accessor.create = jest.fn().mockImplementation(async (record: Partial<ToDoRecord>) => {
      const newRecord = {
        ID: 'new-id',
        DataType: 'ToDo' as const,
        Create: Date.now(),
        Update: Date.now(),
        ...record,
      } as ToDoRecord;
      return newRecord;
    });
    accessor.update = jest.fn().mockImplementation(async (id: string, record: Partial<ToDoRecord>) => {
      const existing = mockRecords.find(r => r.ID === id);
      if (!existing) return null;
      return {
        ...existing,
        ...record,
        Update: Date.now(),
      } as ToDoRecord;
    });
    accessor.delete = jest.fn().mockResolvedValue(undefined);
  });

  describe('constructor', () => {
    it('should create service instance with default cache enabled', () => {
      const serviceWithCache = new ToDoService();
      expect(serviceWithCache).toBeInstanceOf(ToDoService);
    });

    it('should create service instance with cache disabled', () => {
      const serviceNoCache = new ToDoService(false);
      expect(serviceNoCache).toBeInstanceOf(ToDoService);
    });
  });

  describe('recordToData', () => {
    it('should correctly convert record to data', async () => {
      const record: ToDoRecord = {
        ID: 'test-id',
        DataType: 'ToDo',
        TerminalID: 'terminal-123',
        Title: 'Test ToDo',
        DueDate: '2024-10-25',
        Priority: 'Must',
        Create: 1697000000000,
        Update: 1697100000000,
      };

      // Use the protected method through a workaround
      const data = (service as any).recordToData(record);

      expect(data.id).toBe('test-id');
      expect(data.terminalId).toBe('terminal-123');
      expect(data.title).toBe('Test ToDo');
      expect(data.dueDate).toBe('2024-10-25');
      expect(data.priority).toBe('Must');
      expect(data.create).toBe(1697000000000);
      expect(data.update).toBe(1697100000000);
    });

    it('should handle all priority levels', async () => {
      const priorities: Array<'Must' | 'Should' | 'Could'> = ['Must', 'Should', 'Could'];

      priorities.forEach(priority => {
        const record: ToDoRecord = {
          ID: 'test-id',
          DataType: 'ToDo',
          TerminalID: 'terminal-123',
          Title: 'Test ToDo',
          DueDate: '2024-10-25',
          Priority: priority,
          Create: 1697000000000,
          Update: 1697000000000,
        };

        const data = (service as any).recordToData(record);
        expect(data.priority).toBe(priority);
      });
    });
  });

  describe('dataToRecord', () => {
    it('should correctly convert data to record', () => {
      const data: Partial<ToDoData> = {
        terminalId: 'terminal-456',
        title: 'New ToDo',
        dueDate: '2024-11-01',
        priority: 'Should',
      };

      const record = (service as any).dataToRecord(data);

      expect(record.TerminalID).toBe('terminal-456');
      expect(record.Title).toBe('New ToDo');
      expect(record.DueDate).toBe('2024-11-01');
      expect(record.Priority).toBe('Should');
    });

    it('should handle partial data', () => {
      const data: Partial<ToDoData> = {
        title: 'Partial ToDo',
      };

      const record = (service as any).dataToRecord(data);

      expect(record.Title).toBe('Partial ToDo');
      expect(record.TerminalID).toBeUndefined();
      expect(record.DueDate).toBeUndefined();
      expect(record.Priority).toBeUndefined();
    });
  });

  describe('get', () => {
    it('should retrieve all todos and convert to data', async () => {
      const todos = await service.get();

      expect(todos).toHaveLength(3);
      expect(todos[0].id).toBe('todo-1');
      expect(todos[0].title).toBe('Complete project documentation');
      expect(todos[1].id).toBe('todo-2');
      expect(todos[2].id).toBe('todo-3');
      expect((service as any).accessor.get).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no todos exist', async () => {
      (service as any).accessor.get.mockResolvedValue([]);

      const todos = await service.get();

      expect(todos).toEqual([]);
      expect((service as any).accessor.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should retrieve a specific todo by id', async () => {
      const todo = await service.getById('todo-1');

      expect(todo).not.toBeNull();
      expect(todo?.id).toBe('todo-1');
      expect(todo?.title).toBe('Complete project documentation');
      expect(todo?.terminalId).toBe('terminal-111');
      expect((service as any).accessor.getById).toHaveBeenCalledWith('todo-1');
    });

    it('should return null when todo not found', async () => {
      const todo = await service.getById('non-existent-id');

      expect(todo).toBeNull();
      expect((service as any).accessor.getById).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const newData: Partial<ToDoData> = {
        terminalId: 'terminal-999',
        title: 'New ToDo Item',
        dueDate: '2024-12-01',
        priority: 'Must',
      };

      const created = await service.create(newData);

      expect(created.id).toBeDefined();
      expect(created.title).toBe('New ToDo Item');
      expect(created.terminalId).toBe('terminal-999');
      expect((service as any).accessor.create).toHaveBeenCalledWith(
        expect.objectContaining({
          TerminalID: 'terminal-999',
          Title: 'New ToDo Item',
          DueDate: '2024-12-01',
          Priority: 'Must',
        })
      );
    });
  });

  describe('update', () => {
    it('should update an existing todo', async () => {
      const updates: Partial<ToDoData> = {
        title: 'Updated documentation',
        dueDate: '2024-10-25',
        priority: 'Should',
      };

      const updated = await service.update('todo-1', updates);

      expect(updated.id).toBe('todo-1');
      expect(updated.title).toBe('Updated documentation');
      expect(updated.priority).toBe('Should');
      expect((service as any).accessor.update).toHaveBeenCalledWith(
        'todo-1',
        expect.objectContaining({
          Title: 'Updated documentation',
          DueDate: '2024-10-25',
          Priority: 'Should',
        })
      );
    });
  });

  describe('delete', () => {
    it('should delete a todo', async () => {
      await service.delete('todo-1');

      expect((service as any).accessor.delete).toHaveBeenCalledWith('todo-1');
    });
  });

  describe('getByTerminalId', () => {
    it('should retrieve todos for a specific terminal', async () => {
      const todos = await service.getByTerminalId('terminal-111');

      expect(todos).toHaveLength(2);
      expect(todos[0].terminalId).toBe('terminal-111');
      expect(todos[1].terminalId).toBe('terminal-111');
      expect(todos[0].title).toBe('Complete project documentation');
      expect(todos[1].title).toBe('Review pull requests');
      expect((service as any).accessor.getByTerminalId).toHaveBeenCalledWith('terminal-111');
    });

    it('should return empty array when terminal has no todos', async () => {
      (service as any).accessor.getByTerminalId.mockResolvedValue([]);

      const todos = await service.getByTerminalId('non-existent-terminal');

      expect(todos).toEqual([]);
      expect((service as any).accessor.getByTerminalId).toHaveBeenCalledWith('non-existent-terminal');
    });

    it('should only return todos for the specified terminal', async () => {
      const todos = await service.getByTerminalId('terminal-222');

      expect(todos).toHaveLength(1);
      expect(todos[0].terminalId).toBe('terminal-222');
      expect(todos[0].title).toBe('Team meeting preparation');
    });
  });

  describe('getByDueDate', () => {
    it('should retrieve todos for a specific due date', async () => {
      const todos = await service.getByDueDate('2024-10-20');

      expect(todos).toHaveLength(2);
      expect(todos[0].dueDate).toBe('2024-10-20');
      expect(todos[1].dueDate).toBe('2024-10-20');
      expect(todos.some(t => t.terminalId === 'terminal-111')).toBe(true);
      expect(todos.some(t => t.terminalId === 'terminal-222')).toBe(true);
      expect((service as any).accessor.getByDueDate).toHaveBeenCalledWith('2024-10-20');
    });

    it('should return empty array when no todos exist for the date', async () => {
      (service as any).accessor.getByDueDate.mockResolvedValue([]);

      const todos = await service.getByDueDate('2099-12-31');

      expect(todos).toEqual([]);
      expect((service as any).accessor.getByDueDate).toHaveBeenCalledWith('2099-12-31');
    });

    it('should return todos from multiple terminals with same due date', async () => {
      const todos = await service.getByDueDate('2024-10-20');

      expect(todos).toHaveLength(2);
      const terminalIds = todos.map(t => t.terminalId);
      expect(terminalIds).toContain('terminal-111');
      expect(terminalIds).toContain('terminal-222');
    });

    it('should handle single todo for a due date', async () => {
      const todos = await service.getByDueDate('2024-10-21');

      expect(todos).toHaveLength(1);
      expect(todos[0].dueDate).toBe('2024-10-21');
      expect(todos[0].title).toBe('Review pull requests');
    });
  });

  describe('data consistency', () => {
    it('should maintain data integrity through conversion cycle', async () => {
      const originalRecord: ToDoRecord = {
        ID: 'test-cycle',
        DataType: 'ToDo',
        TerminalID: 'terminal-test',
        Title: 'Test Cycle',
        DueDate: '2024-10-30',
        Priority: 'Must',
        Create: 1697000000000,
        Update: 1697100000000,
      };

      // Record -> Data
      const data = (service as any).recordToData(originalRecord);
      
      // Data -> Record (partial)
      const partialRecord = (service as any).dataToRecord(data);

      // Verify key fields are preserved
      expect(partialRecord.TerminalID).toBe(originalRecord.TerminalID);
      expect(partialRecord.Title).toBe(originalRecord.Title);
      expect(partialRecord.DueDate).toBe(originalRecord.DueDate);
      expect(partialRecord.Priority).toBe(originalRecord.Priority);
    });
  });

  describe('edge cases', () => {
    it('should handle todos with special characters in title', async () => {
      const record: ToDoRecord = {
        ID: 'special-id',
        DataType: 'ToDo',
        TerminalID: 'terminal-123',
        Title: 'ToDo with 特殊文字 & symbols!@#',
        DueDate: '2024-10-20',
        Priority: 'Must',
        Create: Date.now(),
        Update: Date.now(),
      };

      const data = (service as any).recordToData(record);
      expect(data.title).toBe('ToDo with 特殊文字 & symbols!@#');
    });

    it('should handle long titles', async () => {
      const longTitle = 'A'.repeat(500);
      const record: ToDoRecord = {
        ID: 'long-id',
        DataType: 'ToDo',
        TerminalID: 'terminal-123',
        Title: longTitle,
        DueDate: '2024-10-20',
        Priority: 'Must',
        Create: Date.now(),
        Update: Date.now(),
      };

      const data = (service as any).recordToData(record);
      expect(data.title).toBe(longTitle);
    });
  });
});
