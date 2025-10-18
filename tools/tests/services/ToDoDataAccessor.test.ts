import { ToDoRecord } from '@tools/interfaces/ToDoRecord';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';

// Mock EnvironmentalUtil to control environment
jest.mock('@common/utils/EnvironmentalUtil');

// Mock DataAccessorBase completely to avoid AWS SDK dependencies
jest.mock('@common/services/DataAccessorBase', () => {
  return {
    __esModule: true,
    default: class DataAccessorBaseMock {
      private tableName: string;
      private dataType: string;
      
      constructor(tableName: string, dataType: string) {
        this.tableName = tableName;
        this.dataType = dataType;
      }
      
      getTableName() {
        return this.tableName;
      }
      
      getDataType() {
        return this.dataType;
      }
      
      async get(): Promise<any[]> {
        return [];
      }
    }
  };
});

import ToDoDataAccessor from '@tools/services/ToDoDataAccessor';

describe('ToDoDataAccessor', () => {
  let accessor: ToDoDataAccessor;
  let mockData: ToDoRecord[];
  
  beforeEach(() => {
    // Default to local environment
    (EnvironmentalUtil.GetProcessEnv as jest.Mock).mockReturnValue('local');
    
    // Setup mock data for tests
    mockData = [
      {
        ID: 'todo-1',
        DataType: 'ToDo',
        TerminalID: 'terminal-111',
        Title: 'Terminal 1 ToDo 1',
        DueDate: '2024-10-20',
        Priority: 'Must',
        Create: Date.now(),
        Update: Date.now(),
      },
      {
        ID: 'todo-2',
        DataType: 'ToDo',
        TerminalID: 'terminal-111',
        Title: 'Terminal 1 ToDo 2',
        DueDate: '2024-10-21',
        Priority: 'Should',
        Create: Date.now(),
        Update: Date.now(),
      },
      {
        ID: 'todo-3',
        DataType: 'ToDo',
        TerminalID: 'terminal-222',
        Title: 'Terminal 2 ToDo',
        DueDate: '2024-10-20',
        Priority: 'Could',
        Create: Date.now(),
        Update: Date.now(),
      },
      {
        ID: 'todo-4',
        DataType: 'ToDo',
        TerminalID: 'terminal-222',
        Title: 'Terminal 2 ToDo 2',
        DueDate: '2024-10-22',
        Priority: 'Must',
        Create: Date.now(),
        Update: Date.now(),
      },
    ];
    
    accessor = new ToDoDataAccessor();
    
    // Mock the get() method to return our test data
    (accessor.get as jest.Mock) = jest.fn().mockResolvedValue(mockData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor and table name', () => {
    it('should use DevTools table for local environment', () => {
      (EnvironmentalUtil.GetProcessEnv as jest.Mock).mockReturnValue('local');
      const localAccessor = new ToDoDataAccessor();
      expect(localAccessor.getTableName()).toBe('DevTools');
    });

    it('should use DevTools table for development environment', () => {
      (EnvironmentalUtil.GetProcessEnv as jest.Mock).mockReturnValue('development');
      const devAccessor = new ToDoDataAccessor();
      expect(devAccessor.getTableName()).toBe('DevTools');
    });

    it('should use Tools table for production environment', () => {
      (EnvironmentalUtil.GetProcessEnv as jest.Mock).mockReturnValue('production');
      const prodAccessor = new ToDoDataAccessor();
      expect(prodAccessor.getTableName()).toBe('Tools');
    });

    it('should set DataType to "ToDo"', () => {
      expect(accessor.getDataType()).toBe('ToDo');
    });
  });



  describe('getByTerminalId', () => {
    it('should return empty array when no todos exist for terminal', async () => {
      const results = await accessor.getByTerminalId('non-existent-terminal');
      expect(results).toEqual([]);
    });

    it('should return todos for specific terminal', async () => {
      const results = await accessor.getByTerminalId('terminal-111');
      expect(results.length).toBe(2);
      expect(results.every(t => t.TerminalID === 'terminal-111')).toBe(true);
      expect(results.some(t => t.Title === 'Terminal 1 ToDo 1')).toBe(true);
      expect(results.some(t => t.Title === 'Terminal 1 ToDo 2')).toBe(true);
    });

    it('should return todos for different terminal', async () => {
      const results = await accessor.getByTerminalId('terminal-222');
      expect(results.length).toBe(2);
      expect(results.every(t => t.TerminalID === 'terminal-222')).toBe(true);
      expect(results.some(t => t.Title === 'Terminal 2 ToDo')).toBe(true);
      expect(results.some(t => t.Title === 'Terminal 2 ToDo 2')).toBe(true);
    });

    it('should not return todos from other terminals', async () => {
      const results = await accessor.getByTerminalId('terminal-111');
      expect(results.every(t => t.TerminalID === 'terminal-111')).toBe(true);
      expect(results.some(t => t.TerminalID === 'terminal-222')).toBe(false);
    });

    it('should call get() method once', async () => {
      await accessor.getByTerminalId('terminal-111');
      expect(accessor.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByDueDate', () => {
    it('should return empty array when no todos exist for date', async () => {
      const results = await accessor.getByDueDate('2099-12-31');
      expect(results).toEqual([]);
    });

    it('should return todos for specific due date', async () => {
      const results = await accessor.getByDueDate('2024-10-20');
      expect(results.length).toBe(2);
      expect(results.every(t => t.DueDate === '2024-10-20')).toBe(true);
      expect(results.some(t => t.TerminalID === 'terminal-111')).toBe(true);
      expect(results.some(t => t.TerminalID === 'terminal-222')).toBe(true);
    });

    it('should return todos from multiple terminals with same due date', async () => {
      const results = await accessor.getByDueDate('2024-10-20');
      expect(results.length).toBe(2);
      expect(results.every(t => t.DueDate === '2024-10-20')).toBe(true);
      
      const terminalIds = results.map(t => t.TerminalID);
      expect(terminalIds).toContain('terminal-111');
      expect(terminalIds).toContain('terminal-222');
    });

    it('should return todos for different due date', async () => {
      const results = await accessor.getByDueDate('2024-10-21');
      expect(results.length).toBe(1);
      expect(results[0].DueDate).toBe('2024-10-21');
      expect(results[0].Title).toBe('Terminal 1 ToDo 2');
    });

    it('should not return todos with different due dates', async () => {
      const results = await accessor.getByDueDate('2024-10-20');
      expect(results.every(t => t.DueDate === '2024-10-20')).toBe(true);
      expect(results.some(t => t.DueDate === '2024-10-21')).toBe(false);
      expect(results.some(t => t.DueDate === '2024-10-22')).toBe(false);
    });

    it('should call get() method once', async () => {
      await accessor.getByDueDate('2024-10-20');
      expect(accessor.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('combined filtering scenarios', () => {
    it('should handle filtering by both TerminalID and DueDate independently', async () => {
      // Reset accessor to clear call count
      jest.clearAllMocks();
      
      const byTerminal = await accessor.getByTerminalId('terminal-111');
      expect(byTerminal.length).toBe(2);
      expect(byTerminal.every(t => t.TerminalID === 'terminal-111')).toBe(true);

      const byDate = await accessor.getByDueDate('2024-10-20');
      expect(byDate.length).toBe(2);
      expect(byDate.every(t => t.DueDate === '2024-10-20')).toBe(true);
      
      // Verify each method calls get() independently
      expect(accessor.get).toHaveBeenCalledTimes(2);
    });

    it('should correctly filter when terminal has todos on different dates', async () => {
      const byTerminal = await accessor.getByTerminalId('terminal-111');
      expect(byTerminal.length).toBe(2);
      
      const dueDates = byTerminal.map(t => t.DueDate);
      expect(dueDates).toContain('2024-10-20');
      expect(dueDates).toContain('2024-10-21');
    });

    it('should correctly filter when date has todos from different terminals', async () => {
      const byDate = await accessor.getByDueDate('2024-10-20');
      expect(byDate.length).toBe(2);
      
      const terminalIds = byDate.map(t => t.TerminalID);
      expect(terminalIds).toContain('terminal-111');
      expect(terminalIds).toContain('terminal-222');
    });
  });
});
