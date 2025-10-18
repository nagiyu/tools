/**
 * Tests for ExpirationDataAccessor
 */

import ExpirationDataAccessor from '@tools/accessors/ExpirationDataAccessor';
import { ExpirationRecord } from '@tools/types/ExpirationTypes';
import { EXPIRATION_DATA_TYPE } from '@tools/consts/ExpirationConsts';

// Mock the EnvironmentalUtil
jest.mock('@common/utils/EnvironmentalUtil', () => ({
  default: {
    GetProcessEnv: jest.fn(() => 'local'),
  },
}));

describe('ExpirationDataAccessor', () => {
  let accessor: ExpirationDataAccessor;

  beforeEach(() => {
    accessor = new ExpirationDataAccessor();
  });

  describe('Constructor', () => {
    it('should create an instance of ExpirationDataAccessor', () => {
      expect(accessor).toBeInstanceOf(ExpirationDataAccessor);
    });

    it('should set correct table name for local environment', () => {
      expect(accessor.getTableName()).toBe('DevTools');
    });

    it('should set correct DataType', () => {
      expect(accessor.getDataType()).toBe(EXPIRATION_DATA_TYPE);
      expect(accessor.getDataType()).toBe('Expiration');
    });
  });

  describe('Table name based on environment', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return "Tools" for production environment', () => {
      const EnvironmentalUtil = require('@common/utils/EnvironmentalUtil').default;
      EnvironmentalUtil.GetProcessEnv.mockReturnValue('production');
      
      const productionAccessor = new ExpirationDataAccessor();
      expect(productionAccessor.getTableName()).toBe('Tools');
    });

    it('should return "DevTools" for development environment', () => {
      const EnvironmentalUtil = require('@common/utils/EnvironmentalUtil').default;
      EnvironmentalUtil.GetProcessEnv.mockReturnValue('development');
      
      const devAccessor = new ExpirationDataAccessor();
      expect(devAccessor.getTableName()).toBe('DevTools');
    });

    it('should return "DevTools" for local environment', () => {
      const EnvironmentalUtil = require('@common/utils/EnvironmentalUtil').default;
      EnvironmentalUtil.GetProcessEnv.mockReturnValue('local');
      
      const localAccessor = new ExpirationDataAccessor();
      expect(localAccessor.getTableName()).toBe('DevTools');
    });
  });
});
