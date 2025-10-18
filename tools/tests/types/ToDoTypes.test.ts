import { PRIORITY_LEVELS } from '@tools/consts/ToDoConsts';
import { PriorityType } from '@tools/types/ToDoTypes';
import { ToDoRecord } from '@tools/interfaces/ToDoRecord';
import { ToDoData } from '@tools/interfaces/ToDoData';
import { NotificationSettingRecord } from '@tools/interfaces/NotificationSettingRecord';
import { NotificationSettingData } from '@tools/interfaces/NotificationSettingData';

describe('ToDoTypes', () => {
  describe('Priority Levels', () => {
    it('should have correct priority levels', () => {
      expect(PRIORITY_LEVELS).toEqual(['Must', 'Should', 'Could']);
    });

    it('should validate PriorityType correctly', () => {
      const mustPriority: PriorityType = 'Must';
      const shouldPriority: PriorityType = 'Should';
      const couldPriority: PriorityType = 'Could';
      
      expect(mustPriority).toBe('Must');
      expect(shouldPriority).toBe('Should');
      expect(couldPriority).toBe('Could');
    });
  });

  describe('ToDoRecord', () => {
    it('should create a valid ToDoRecord', () => {
      const record: ToDoRecord = {
        ID: 'test-uuid',
        DataType: 'ToDo',
        TerminalID: 'terminal-123',
        Title: 'Test Task',
        DueDate: '2024-10-20',
        Priority: 'Must',
        Create: Date.now(),
        Update: Date.now(),
      };

      expect(record.ID).toBe('test-uuid');
      expect(record.DataType).toBe('ToDo');
      expect(record.TerminalID).toBe('terminal-123');
      expect(record.Title).toBe('Test Task');
      expect(record.DueDate).toBe('2024-10-20');
      expect(record.Priority).toBe('Must');
      expect(typeof record.Create).toBe('number');
      expect(typeof record.Update).toBe('number');
    });
  });

  describe('ToDoData', () => {
    it('should create a valid ToDoData', () => {
      const now = Date.now();
      const data: ToDoData = {
        id: 'test-uuid',
        terminalId: 'terminal-123',
        title: 'Test Task',
        dueDate: '2024-10-20',
        priority: 'Should',
        create: now,
        update: now,
      };

      expect(data.id).toBe('test-uuid');
      expect(data.terminalId).toBe('terminal-123');
      expect(data.title).toBe('Test Task');
      expect(data.dueDate).toBe('2024-10-20');
      expect(data.priority).toBe('Should');
      expect(typeof data.create).toBe('number');
      expect(typeof data.update).toBe('number');
    });
  });

  describe('NotificationSettingRecord', () => {
    it('should create a valid NotificationSettingRecord', () => {
      const record: NotificationSettingRecord = {
        ID: 'terminal-123',
        DataType: 'NotificationSetting',
        TerminalID: 'terminal-123',
        Enabled: true,
        NotificationHour: 9,
        Timezone: 'Asia/Tokyo',
        Create: Date.now(),
        Update: Date.now(),
      };

      expect(record.ID).toBe('terminal-123');
      expect(record.DataType).toBe('NotificationSetting');
      expect(record.TerminalID).toBe('terminal-123');
      expect(record.Enabled).toBe(true);
      expect(record.NotificationHour).toBe(9);
      expect(record.Timezone).toBe('Asia/Tokyo');
      expect(typeof record.Create).toBe('number');
      expect(typeof record.Update).toBe('number');
    });

    it('should validate NotificationHour range (0-23)', () => {
      const record: NotificationSettingRecord = {
        ID: 'terminal-123',
        DataType: 'NotificationSetting',
        TerminalID: 'terminal-123',
        Enabled: true,
        NotificationHour: 0,
        Timezone: 'Asia/Tokyo',
        Create: Date.now(),
        Update: Date.now(),
      };

      expect(record.NotificationHour).toBeGreaterThanOrEqual(0);
      expect(record.NotificationHour).toBeLessThanOrEqual(23);
    });
  });

  describe('NotificationSettingData', () => {
    it('should create a valid NotificationSettingData', () => {
      const now = Date.now();
      const data: NotificationSettingData = {
        id: 'terminal-123',
        terminalId: 'terminal-123',
        enabled: false,
        notificationHour: 18,
        timezone: 'America/New_York',
        create: now,
        update: now,
      };

      expect(data.id).toBe('terminal-123');
      expect(data.terminalId).toBe('terminal-123');
      expect(data.enabled).toBe(false);
      expect(data.notificationHour).toBe(18);
      expect(data.timezone).toBe('America/New_York');
      expect(typeof data.create).toBe('number');
      expect(typeof data.update).toBe('number');
    });
  });
});
