/**
 * ExpirationSettingsAccessor
 * 
 * Provides DynamoDB access for expiration settings data.
 * Extends DataAccessorBase to provide CRUD operations for ExpirationSettingsRecord.
 */

import DataAccessorBase from '@common/services/DataAccessorBase';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';
import { ExpirationSettingsRecord } from '@tools/types/ExpirationTypes';
import { EXPIRATION_SETTINGS_DATA_TYPE } from '@tools/consts/ExpirationConsts';

export default class ExpirationSettingsAccessor extends DataAccessorBase<ExpirationSettingsRecord> {
  constructor() {
    super(ExpirationSettingsAccessor.getTableName(), EXPIRATION_SETTINGS_DATA_TYPE);
  }

  /**
   * Get table name based on environment
   * @returns DynamoDB table name
   */
  private static getTableName(): string {
    const env = EnvironmentalUtil.GetProcessEnv();
    switch (env) {
      case 'production':
        return 'Tools';
      case 'development':
      case 'local':
      default:
        return 'DevTools';
    }
  }
}
