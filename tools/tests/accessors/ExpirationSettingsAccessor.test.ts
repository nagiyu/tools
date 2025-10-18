/**
 * Tests for ExpirationSettingsAccessor
 */

import ExpirationSettingsAccessor from '@tools/accessors/ExpirationSettingsAccessor';
import { ExpirationSettingsRecord } from '@tools/types/ExpirationTypes';
import { EXPIRATION_SETTINGS_DATA_TYPE } from '@tools/consts/ExpirationConsts';

// Mock the EnvironmentalUtil
jest.mock('@common/utils/EnvironmentalUtil', () => ({
  default: {
    GetProcessEnv: jest.fn(() => 'local'),
  },
}));

describe('ExpirationSettingsAccessor', () => {
  let accessor: ExpirationSettingsAccessor;

  beforeEach(() => {
    accessor = new ExpirationSettingsAccessor();
  });

  describe('Constructor', () => {
    it('should create an instance of ExpirationSettingsAccessor', () => {
      expect(accessor).toBeInstanceOf(ExpirationSettingsAccessor);
    });

    it('should set correct table name for local environment', () => {
      expect(accessor.getTableName()).toBe('DevTools');
    });

    it('should set correct DataType', () => {
      expect(accessor.getDataType()).toBe(EXPIRATION_SETTINGS_DATA_TYPE);
      expect(accessor.getDataType()).toBe('ExpirationSettings');
    });
  });

  describe('Table name based on environment', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return "Tools" for production environment', () => {
      const EnvironmentalUtil = require('@common/utils/EnvironmentalUtil').default;
      EnvironmentalUtil.GetProcessEnv.mockReturnValue('production');
      
      const productionAccessor = new ExpirationSettingsAccessor();
      expect(productionAccessor.getTableName()).toBe('Tools');
    });

    it('should return "DevTools" for development environment', () => {
      const EnvironmentalUtil = require('@common/utils/EnvironmentalUtil').default;
      EnvironmentalUtil.GetProcessEnv.mockReturnValue('development');
      
      const devAccessor = new ExpirationSettingsAccessor();
      expect(devAccessor.getTableName()).toBe('DevTools');
    });

    it('should return "DevTools" for local environment', () => {
      const EnvironmentalUtil = require('@common/utils/EnvironmentalUtil').default;
      EnvironmentalUtil.GetProcessEnv.mockReturnValue('local');
      
      const localAccessor = new ExpirationSettingsAccessor();
      expect(localAccessor.getTableName()).toBe('DevTools');
    });
  });
});
