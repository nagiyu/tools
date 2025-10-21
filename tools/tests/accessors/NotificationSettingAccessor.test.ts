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
});
