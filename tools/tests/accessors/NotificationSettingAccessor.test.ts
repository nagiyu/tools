/**
 * Tests for NotificationSettingAccessor
 */

import NotificationSettingAccessor from '@tools/accessors/NotificationSettingAccessor';
import { NotificationSettingRecord } from '@tools/interfaces/NotificationSettingRecord';
import { NOTIFICATION_SETTING_DATA_TYPE } from '@tools/consts/NotificationSettingConsts';

// Mock DataAccessorBase to avoid AWS SDK dependencies
jest.mock('@common/services/DataAccessorBase', () => {
  return {
    __esModule: true,
    default: class DataAccessorBaseMock {
      private tableName: string;
      private dataType: string;
      private mockRecords: any[] = [];

      constructor(tableName: string, dataType: string) {
        this.tableName = tableName;
        this.dataType = dataType;
      }

      getTableName(): string {
        return this.tableName;
      }

      getDataType(): string {
        return this.dataType;
      }

      async get(): Promise<any[]> {
        return this.mockRecords;
      }
      
      setMockRecords(records: any[]): void {
        this.mockRecords = records;
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
    }
  };
});

// Mock the EnvironmentalUtil
jest.mock('@common/utils/EnvironmentalUtil', () => ({
  __esModule: true,
  default: {
    GetProcessEnv: jest.fn(() => 'local'),
  },
}));

describe('NotificationSettingAccessor', () => {
  let accessor: NotificationSettingAccessor;

  beforeEach(() => {
    accessor = new NotificationSettingAccessor();
  });

  describe('Constructor', () => {
    it('should create an instance of NotificationSettingAccessor', () => {
      expect(accessor).toBeInstanceOf(NotificationSettingAccessor);
    });

    it('should set correct table name for local environment', () => {
      expect(accessor.getTableName()).toBe('DevTools');
    });

    it('should set correct DataType', () => {
      expect(accessor.getDataType()).toBe(NOTIFICATION_SETTING_DATA_TYPE);
      expect(accessor.getDataType()).toBe('NotificationSetting');
    });
  });

  describe('Table name based on environment', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return "Tools" for production environment', () => {
      const EnvironmentalUtil = require('@common/utils/EnvironmentalUtil').default;
      EnvironmentalUtil.GetProcessEnv.mockReturnValue('production');
      
      const productionAccessor = new NotificationSettingAccessor();
      expect(productionAccessor.getTableName()).toBe('Tools');
    });

    it('should return "DevTools" for development environment', () => {
      const EnvironmentalUtil = require('@common/utils/EnvironmentalUtil').default;
      EnvironmentalUtil.GetProcessEnv.mockReturnValue('development');
      
      const devAccessor = new NotificationSettingAccessor();
      expect(devAccessor.getTableName()).toBe('DevTools');
    });

    it('should return "DevTools" for local environment', () => {
      const EnvironmentalUtil = require('@common/utils/EnvironmentalUtil').default;
      EnvironmentalUtil.GetProcessEnv.mockReturnValue('local');
      
      const localAccessor = new NotificationSettingAccessor();
      expect(localAccessor.getTableName()).toBe('DevTools');
    });
  });

  describe('getByTerminalId', () => {
    it('should return notification setting for a specific terminal ID', async () => {
      const mockSetting: NotificationSettingRecord = {
        ID: 'terminal-123',
        DataType: 'NotificationSetting',
        TerminalID: 'terminal-123',
        Enabled: true,
        NotificationHour: 9,
        Timezone: 'Asia/Tokyo',
        Create: Date.now(),
        Update: Date.now(),
      };

      // Mock the get method to return test data
      jest.spyOn(accessor as any, 'get').mockResolvedValue([mockSetting]);

      const result = await accessor.getByTerminalId('terminal-123');
      expect(result).toEqual(mockSetting);
    });

    it('should return null when no setting exists for the terminal ID', async () => {
      jest.spyOn(accessor as any, 'get').mockResolvedValue([]);

      const result = await accessor.getByTerminalId('non-existent');
      expect(result).toBeNull();
    });

    it('should return the first matching setting when multiple exist', async () => {
      const mockSetting1: NotificationSettingRecord = {
        ID: 'terminal-123',
        DataType: 'NotificationSetting',
        TerminalID: 'terminal-123',
        Enabled: true,
        NotificationHour: 9,
        Timezone: 'Asia/Tokyo',
        Create: Date.now(),
        Update: Date.now(),
      };

      const mockSetting2: NotificationSettingRecord = {
        ID: 'terminal-456',
        DataType: 'NotificationSetting',
        TerminalID: 'terminal-456',
        Enabled: false,
        NotificationHour: 12,
        Timezone: 'America/New_York',
        Create: Date.now(),
        Update: Date.now(),
      };

      jest.spyOn(accessor as any, 'get').mockResolvedValue([mockSetting1, mockSetting2]);

      const result = await accessor.getByTerminalId('terminal-123');
      expect(result).toEqual(mockSetting1);
    });
  });
});
