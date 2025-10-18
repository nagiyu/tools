import ToDoDataAccessorMock from '@tools-mock/services/ToDoDataAccessorMock';
import { ToDoRecord } from '@tools/interfaces/ToDoRecord';

describe('ToDoDataAccessorMock', () => {
  let accessor: ToDoDataAccessorMock;

  beforeEach(() => {
    accessor = new ToDoDataAccessorMock();
  });

  afterEach(() => {
    accessor.clearMockData();
  });

  describe('CRUD operations', () => {
    it('should create a ToDo record', async () => {
      const todoData: Partial<ToDoRecord> = {
        TerminalID: 'terminal-123',
        Title: 'Test ToDo',
        DueDate: '2024-10-20',
        Priority: 'Must',
      };

      const created = await accessor.create(todoData);

      expect(created.ID).toBeDefined();
      expect(created.DataType).toBe('ToDo');
      expect(created.TerminalID).toBe('terminal-123');
      expect(created.Title).toBe('Test ToDo');
      expect(created.DueDate).toBe('2024-10-20');
      expect(created.Priority).toBe('Must');
      expect(created.Create).toBeDefined();
      expect(created.Update).toBeDefined();
    });

    it('should get all ToDo records', async () => {
      const todo1: Partial<ToDoRecord> = {
        TerminalID: 'terminal-123',
        Title: 'ToDo 1',
        DueDate: '2024-10-20',
        Priority: 'Must',
      };
      const todo2: Partial<ToDoRecord> = {
        TerminalID: 'terminal-456',
        Title: 'ToDo 2',
        DueDate: '2024-10-21',
        Priority: 'Should',
      };

      await accessor.create(todo1);
      await accessor.create(todo2);

      const results = await accessor.get();
      expect(results.length).toBe(2);
      expect(results.some(r => r.Title === 'ToDo 1')).toBe(true);
      expect(results.some(r => r.Title === 'ToDo 2')).toBe(true);
    });

    it('should get a ToDo record by ID', async () => {
      const todoData: Partial<ToDoRecord> = {
        TerminalID: 'terminal-123',
        Title: 'Test ToDo',
        DueDate: '2024-10-20',
        Priority: 'Could',
      };

      const created = await accessor.create(todoData);
      const retrieved = await accessor.getById(created.ID);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.ID).toBe(created.ID);
      expect(retrieved?.Title).toBe('Test ToDo');
      expect(retrieved?.Priority).toBe('Could');
    });

    it('should update a ToDo record', async () => {
      const todoData: Partial<ToDoRecord> = {
        TerminalID: 'terminal-123',
        Title: 'Original Title',
        DueDate: '2024-10-20',
        Priority: 'Must',
      };

      const created = await accessor.create(todoData);
      const updates: Partial<ToDoRecord> = {
        Title: 'Updated Title',
        Priority: 'Should',
        DueDate: '2024-10-25',
      };

      const updated = await accessor.update(created.ID, updates);

      expect(updated).not.toBeNull();
      expect(updated?.Title).toBe('Updated Title');
      expect(updated?.Priority).toBe('Should');
      expect(updated?.DueDate).toBe('2024-10-25');
      expect(updated?.TerminalID).toBe('terminal-123');
    });

    it('should delete a ToDo record', async () => {
      const todoData: Partial<ToDoRecord> = {
        TerminalID: 'terminal-123',
        Title: 'To Be Deleted',
        DueDate: '2024-10-20',
        Priority: 'Could',
      };

      const created = await accessor.create(todoData);
      await accessor.delete(created.ID);

      const retrieved = await accessor.getById(created.ID);
      expect(retrieved).toBeNull();
    });

    it('should return null when updating non-existent record', async () => {
      const result = await accessor.update('non-existent-id', { Title: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('getByTerminalId', () => {
    beforeEach(async () => {
      await accessor.create({
        TerminalID: 'terminal-111',
        Title: 'Terminal 1 ToDo 1',
        DueDate: '2024-10-20',
        Priority: 'Must',
      });
      await accessor.create({
        TerminalID: 'terminal-111',
        Title: 'Terminal 1 ToDo 2',
        DueDate: '2024-10-21',
        Priority: 'Should',
      });
      await accessor.create({
        TerminalID: 'terminal-222',
        Title: 'Terminal 2 ToDo',
        DueDate: '2024-10-20',
        Priority: 'Could',
      });
    });

    it('should return empty array when no todos exist for terminal', async () => {
      const results = await accessor.getByTerminalId('non-existent-terminal');
      expect(results).toEqual([]);
    });

    it('should return todos for specific terminal', async () => {
      const results = await accessor.getByTerminalId('terminal-111');
      expect(results.length).toBe(2);
      expect(results.every(t => t.TerminalID === 'terminal-111')).toBe(true);
    });

    it('should not return todos from other terminals', async () => {
      const results = await accessor.getByTerminalId('terminal-111');
      expect(results.some(t => t.TerminalID === 'terminal-222')).toBe(false);
    });
  });

  describe('getByDueDate', () => {
    beforeEach(async () => {
      await accessor.create({
        TerminalID: 'terminal-111',
        Title: 'Terminal 1 ToDo',
        DueDate: '2024-10-20',
        Priority: 'Must',
      });
      await accessor.create({
        TerminalID: 'terminal-222',
        Title: 'Terminal 2 ToDo',
        DueDate: '2024-10-20',
        Priority: 'Should',
      });
      await accessor.create({
        TerminalID: 'terminal-111',
        Title: 'Terminal 1 ToDo 2',
        DueDate: '2024-10-21',
        Priority: 'Could',
      });
    });

    it('should return empty array when no todos exist for date', async () => {
      const results = await accessor.getByDueDate('2099-12-31');
      expect(results).toEqual([]);
    });

    it('should return todos for specific due date', async () => {
      const results = await accessor.getByDueDate('2024-10-20');
      expect(results.length).toBe(2);
      expect(results.every(t => t.DueDate === '2024-10-20')).toBe(true);
    });

    it('should return todos from multiple terminals with same due date', async () => {
      const results = await accessor.getByDueDate('2024-10-20');
      const terminalIds = results.map(t => t.TerminalID);
      expect(terminalIds).toContain('terminal-111');
      expect(terminalIds).toContain('terminal-222');
    });

    it('should not return todos with different due dates', async () => {
      const results = await accessor.getByDueDate('2024-10-20');
      expect(results.some(t => t.DueDate === '2024-10-21')).toBe(false);
    });
  });

  describe('setMockData and clearMockData', () => {
    it('should set mock data', () => {
      const mockData: ToDoRecord[] = [
        {
          ID: 'todo-1',
          DataType: 'ToDo',
          TerminalID: 'terminal-123',
          Title: 'Test ToDo',
          DueDate: '2024-10-20',
          Priority: 'Must',
          Create: Date.now(),
          Update: Date.now(),
        },
      ];

      accessor.setMockData(mockData);
      const data = accessor.getMockData();
      expect(data.length).toBe(1);
      expect(data[0].Title).toBe('Test ToDo');
    });

    it('should clear mock data', async () => {
      await accessor.create({
        TerminalID: 'terminal-123',
        Title: 'Test ToDo',
        DueDate: '2024-10-20',
        Priority: 'Must',
      });

      expect(accessor.getMockData().length).toBe(1);
      
      accessor.clearMockData();
      expect(accessor.getMockData().length).toBe(0);
    });

    it('should return a copy of mock data', () => {
      const mockData: ToDoRecord[] = [
        {
          ID: 'todo-1',
          DataType: 'ToDo',
          TerminalID: 'terminal-123',
          Title: 'Test ToDo',
          DueDate: '2024-10-20',
          Priority: 'Must',
          Create: Date.now(),
          Update: Date.now(),
        },
      ];

      accessor.setMockData(mockData);
      const data1 = accessor.getMockData();
      const data2 = accessor.getMockData();
      
      expect(data1).not.toBe(data2); // Different references
      expect(data1).toEqual(data2); // Same content
    });
  });
});
