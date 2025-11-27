/**
 * Tests for ToDo Notification Batch Lambda Function
 */

import {
  formatDate,
  getCurrentHour,
  groupByTerminalId,
  buildNotificationMessage,
  shouldSendNotification,
  handler,
} from './index';
import { ScheduledEvent, Context } from 'aws-lambda';

/**
 * Mock interface for ToDoData (matching the expected structure)
 */
interface MockToDoData {
  id: string;
  terminalId: string;
  title: string;
  dueDate: string;
  priority: 'Must' | 'Should' | 'Could';
  create: number;
  update: number;
}

/**
 * Mock interface for MockNotificationSettingRecord (matching the expected structure)
 */
interface MockNotificationSettingRecord {
  ID: string;
  DataType: string;
  TerminalID: string;
  Enabled: boolean;
  NotificationHour: number;
  Timezone: string;
  Create: number;
  Update: number;
}

// Mock ToDoService
jest.mock('@tools/services/ToDoService', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      getByDueDate: jest.fn(),
    })),
  };
});

// Mock NotificationSettingAccessor
jest.mock('@tools/accessors/NotificationSettingAccessor', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      getByTerminalId: jest.fn(),
    })),
  };
});

describe('ToDo Notification Batch Lambda', () => {
  describe('formatDate', () => {
    it('should format date as YYYY-MM-DD for Asia/Tokyo timezone', () => {
      // 2024-10-20 15:00:00 UTC = 2024-10-21 00:00:00 JST
      const date = new Date('2024-10-20T15:00:00.000Z');
      const result = formatDate(date, 'Asia/Tokyo');
      expect(result).toBe('2024-10-21');
    });

    it('should format date correctly for UTC timezone', () => {
      const date = new Date('2024-10-20T15:00:00.000Z');
      const result = formatDate(date, 'UTC');
      expect(result).toBe('2024-10-20');
    });

    it('should handle date at midnight JST', () => {
      // 2024-10-20 00:00:00 JST = 2024-10-19 15:00:00 UTC
      const date = new Date('2024-10-19T15:00:00.000Z');
      const result = formatDate(date, 'Asia/Tokyo');
      expect(result).toBe('2024-10-20');
    });
  });

  describe('getCurrentHour', () => {
    it('should return correct hour for Asia/Tokyo timezone', () => {
      // 2024-10-20 00:00:00 UTC = 2024-10-20 09:00:00 JST
      const date = new Date('2024-10-20T00:00:00.000Z');
      const result = getCurrentHour(date, 'Asia/Tokyo');
      expect(result).toBe(9);
    });

    it('should return correct hour for UTC timezone', () => {
      const date = new Date('2024-10-20T14:30:00.000Z');
      const result = getCurrentHour(date, 'UTC');
      expect(result).toBe(14);
    });

    it('should handle midnight in Asia/Tokyo', () => {
      // 2024-10-20 15:00:00 UTC = 2024-10-21 00:00:00 JST
      const date = new Date('2024-10-20T15:00:00.000Z');
      const result = getCurrentHour(date, 'Asia/Tokyo');
      expect(result).toBe(0);
    });
  });

  describe('groupByTerminalId', () => {
    it('should group todos by terminal ID', () => {
      const todos: MockToDoData[] = [
        {
          id: '1',
          terminalId: 'terminal-1',
          title: 'Task 1',
          dueDate: '2024-10-20',
          priority: 'Must',
          create: 1697000000000,
          update: 1697000000000,
        },
        {
          id: '2',
          terminalId: 'terminal-1',
          title: 'Task 2',
          dueDate: '2024-10-20',
          priority: 'Should',
          create: 1697000000000,
          update: 1697000000000,
        },
        {
          id: '3',
          terminalId: 'terminal-2',
          title: 'Task 3',
          dueDate: '2024-10-20',
          priority: 'Could',
          create: 1697000000000,
          update: 1697000000000,
        },
      ];

      const result = groupByTerminalId(todos);

      expect(result.size).toBe(2);
      expect(result.get('terminal-1')?.length).toBe(2);
      expect(result.get('terminal-2')?.length).toBe(1);
    });

    it('should return empty map for empty input', () => {
      const result = groupByTerminalId([]);
      expect(result.size).toBe(0);
    });

    it('should handle single todo', () => {
      const todos: MockToDoData[] = [
        {
          id: '1',
          terminalId: 'terminal-1',
          title: 'Task 1',
          dueDate: '2024-10-20',
          priority: 'Must',
          create: 1697000000000,
          update: 1697000000000,
        },
      ];

      const result = groupByTerminalId(todos);
      expect(result.size).toBe(1);
      expect(result.get('terminal-1')?.length).toBe(1);
    });
  });

  describe('buildNotificationMessage', () => {
    it('should build correct message for single todo', () => {
      const todos: MockToDoData[] = [
        {
          id: '1',
          terminalId: 'terminal-1',
          title: 'Complete report',
          dueDate: '2024-10-20',
          priority: 'Must',
          create: 1697000000000,
          update: 1697000000000,
        },
      ];

      const { title, body } = buildNotificationMessage(todos);

      expect(title).toBe('本日のToDo (1件)');
      expect(body).toBe('- 【Must】Complete report');
    });

    it('should build correct message for multiple todos', () => {
      const todos: MockToDoData[] = [
        {
          id: '1',
          terminalId: 'terminal-1',
          title: 'Task 1',
          dueDate: '2024-10-20',
          priority: 'Must',
          create: 1697000000000,
          update: 1697000000000,
        },
        {
          id: '2',
          terminalId: 'terminal-1',
          title: 'Task 2',
          dueDate: '2024-10-20',
          priority: 'Should',
          create: 1697000000000,
          update: 1697000000000,
        },
        {
          id: '3',
          terminalId: 'terminal-1',
          title: 'Task 3',
          dueDate: '2024-10-20',
          priority: 'Could',
          create: 1697000000000,
          update: 1697000000000,
        },
      ];

      const { title, body } = buildNotificationMessage(todos);

      expect(title).toBe('本日のToDo (3件)');
      expect(body).toContain('- 【Must】Task 1');
      expect(body).toContain('- 【Should】Task 2');
      expect(body).toContain('- 【Could】Task 3');
    });

    it('should handle todos with special characters', () => {
      const todos: MockToDoData[] = [
        {
          id: '1',
          terminalId: 'terminal-1',
          title: 'タスク with 特殊文字',
          dueDate: '2024-10-20',
          priority: 'Must',
          create: 1697000000000,
          update: 1697000000000,
        },
      ];

      const { title, body } = buildNotificationMessage(todos);

      expect(title).toBe('本日のToDo (1件)');
      expect(body).toBe('- 【Must】タスク with 特殊文字');
    });
  });

  describe('shouldSendNotification', () => {
    it('should return true when settings are enabled and hour matches', () => {
      const settings: MockNotificationSettingRecord = {
        ID: 'terminal-1',
        DataType: 'NotificationSetting',
        TerminalID: 'terminal-1',
        Enabled: true,
        NotificationHour: 9,
        Timezone: 'Asia/Tokyo',
        Create: 1697000000000,
        Update: 1697000000000,
      };

      expect(shouldSendNotification(settings, 9)).toBe(true);
    });

    it('should return false when settings are disabled', () => {
      const settings: MockNotificationSettingRecord = {
        ID: 'terminal-1',
        DataType: 'NotificationSetting',
        TerminalID: 'terminal-1',
        Enabled: false,
        NotificationHour: 9,
        Timezone: 'Asia/Tokyo',
        Create: 1697000000000,
        Update: 1697000000000,
      };

      expect(shouldSendNotification(settings, 9)).toBe(false);
    });

    it('should return false when hour does not match', () => {
      const settings: MockNotificationSettingRecord = {
        ID: 'terminal-1',
        DataType: 'NotificationSetting',
        TerminalID: 'terminal-1',
        Enabled: true,
        NotificationHour: 9,
        Timezone: 'Asia/Tokyo',
        Create: 1697000000000,
        Update: 1697000000000,
      };

      expect(shouldSendNotification(settings, 10)).toBe(false);
    });

    it('should return false when settings are null', () => {
      expect(shouldSendNotification(null, 9)).toBe(false);
    });

    it('should handle midnight (hour 0)', () => {
      const settings: MockNotificationSettingRecord = {
        ID: 'terminal-1',
        DataType: 'NotificationSetting',
        TerminalID: 'terminal-1',
        Enabled: true,
        NotificationHour: 0,
        Timezone: 'Asia/Tokyo',
        Create: 1697000000000,
        Update: 1697000000000,
      };

      expect(shouldSendNotification(settings, 0)).toBe(true);
      expect(shouldSendNotification(settings, 23)).toBe(false);
    });
  });

  describe('handler', () => {
    let mockToDoService: { getByDueDate: jest.Mock };
    let mockNotificationSettingAccessor: { getByTerminalId: jest.Mock };

    beforeEach(() => {
      jest.clearAllMocks();

      // Get the mock constructors
      const ToDoServiceMock = require('@tools/services/ToDoService').default;
      const NotificationSettingAccessorMock = require('@tools/accessors/NotificationSettingAccessor').default;

      // Create mock instances
      mockToDoService = { getByDueDate: jest.fn() };
      mockNotificationSettingAccessor = { getByTerminalId: jest.fn() };

      // Configure mock constructors to return our mock instances
      ToDoServiceMock.mockImplementation(() => mockToDoService);
      NotificationSettingAccessorMock.mockImplementation(() => mockNotificationSettingAccessor);
    });

    const mockEvent: ScheduledEvent = {
      version: '0',
      id: 'test-id',
      'detail-type': 'Scheduled Event',
      source: 'aws.events',
      account: '123456789012',
      time: '2024-10-20T09:00:00Z',
      region: 'ap-northeast-1',
      resources: [],
      detail: {},
    };

    const mockContext: Context = {
      callbackWaitsForEmptyEventLoop: false,
      functionName: 'test',
      functionVersion: '1',
      invokedFunctionArn: 'arn:aws:lambda:test',
      memoryLimitInMB: '128',
      awsRequestId: 'test-request-id',
      logGroupName: 'test-log-group',
      logStreamName: 'test-log-stream',
      getRemainingTimeInMillis: () => 30000,
      done: () => {},
      fail: () => {},
      succeed: () => {},
    };

    it('should return success with no todos when none are due today', async () => {
      mockToDoService.getByDueDate.mockResolvedValue([]);

      const result = await handler(mockEvent, mockContext, () => {});

      expect(result?.statusCode).toBe(200);
      expect(result?.body).toBe('No ToDo items due today');
      expect(result?.processedTerminals).toBe(0);
      expect(result?.notificationsSent).toBe(0);
    });

    it('should process todos and send notifications when settings match', async () => {
      const todos: MockToDoData[] = [
        {
          id: '1',
          terminalId: 'terminal-1',
          title: 'Task 1',
          dueDate: '2024-10-20',
          priority: 'Must',
          create: 1697000000000,
          update: 1697000000000,
        },
      ];

      const settings: MockNotificationSettingRecord = {
        ID: 'terminal-1',
        DataType: 'NotificationSetting',
        TerminalID: 'terminal-1',
        Enabled: true,
        NotificationHour: new Date().getHours(), // Match current hour
        Timezone: 'UTC',
        Create: 1697000000000,
        Update: 1697000000000,
      };

      mockToDoService.getByDueDate.mockResolvedValue(todos);
      mockNotificationSettingAccessor.getByTerminalId.mockResolvedValue(settings);

      const result = await handler(mockEvent, mockContext, () => {});

      expect(result?.statusCode).toBe(200);
      expect(result?.body).toBe('Success');
      expect(result?.processedTerminals).toBe(1);
    });

    it('should not send notifications when settings are disabled', async () => {
      const todos: MockToDoData[] = [
        {
          id: '1',
          terminalId: 'terminal-1',
          title: 'Task 1',
          dueDate: '2024-10-20',
          priority: 'Must',
          create: 1697000000000,
          update: 1697000000000,
        },
      ];

      const settings: MockNotificationSettingRecord = {
        ID: 'terminal-1',
        DataType: 'NotificationSetting',
        TerminalID: 'terminal-1',
        Enabled: false,
        NotificationHour: 9,
        Timezone: 'Asia/Tokyo',
        Create: 1697000000000,
        Update: 1697000000000,
      };

      mockToDoService.getByDueDate.mockResolvedValue(todos);
      mockNotificationSettingAccessor.getByTerminalId.mockResolvedValue(settings);

      const result = await handler(mockEvent, mockContext, () => {});

      expect(result?.statusCode).toBe(200);
      expect(result?.notificationsSent).toBe(0);
    });

    it('should handle errors gracefully', async () => {
      mockToDoService.getByDueDate.mockRejectedValue(new Error('Database error'));

      const result = await handler(mockEvent, mockContext, () => {});

      expect(result?.statusCode).toBe(500);
      expect(result?.body).toContain('Error');
    });

    it('should continue processing other terminals when one fails', async () => {
      const todos: MockToDoData[] = [
        {
          id: '1',
          terminalId: 'terminal-1',
          title: 'Task 1',
          dueDate: '2024-10-20',
          priority: 'Must',
          create: 1697000000000,
          update: 1697000000000,
        },
        {
          id: '2',
          terminalId: 'terminal-2',
          title: 'Task 2',
          dueDate: '2024-10-20',
          priority: 'Should',
          create: 1697000000000,
          update: 1697000000000,
        },
      ];

      mockToDoService.getByDueDate.mockResolvedValue(todos);
      mockNotificationSettingAccessor.getByTerminalId
        .mockRejectedValueOnce(new Error('Error for terminal-1'))
        .mockResolvedValueOnce({
          ID: 'terminal-2',
          DataType: 'NotificationSetting',
          TerminalID: 'terminal-2',
          Enabled: true,
          NotificationHour: new Date().getHours(),
          Timezone: 'UTC',
          Create: 1697000000000,
          Update: 1697000000000,
        });

      const result = await handler(mockEvent, mockContext, () => {});

      // Should still succeed even though one terminal failed
      expect(result?.statusCode).toBe(200);
      expect(result?.processedTerminals).toBe(2);
    });

    it('should not send notifications when no settings exist for terminal', async () => {
      const todos: MockToDoData[] = [
        {
          id: '1',
          terminalId: 'terminal-1',
          title: 'Task 1',
          dueDate: '2024-10-20',
          priority: 'Must',
          create: 1697000000000,
          update: 1697000000000,
        },
      ];

      mockToDoService.getByDueDate.mockResolvedValue(todos);
      mockNotificationSettingAccessor.getByTerminalId.mockResolvedValue(null);

      const result = await handler(mockEvent, mockContext, () => {});

      expect(result?.statusCode).toBe(200);
      expect(result?.notificationsSent).toBe(0);
    });
  });
});
