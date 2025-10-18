/**
 * ExpirationDataAccessor
 * 
 * Provides DynamoDB access for expiration data.
 * Extends DataAccessorBase to provide CRUD operations for ExpirationRecord.
 */

import DataAccessorBase from '@common/services/DataAccessorBase';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';
import { ExpirationRecord } from '@tools/types/ExpirationTypes';
import { EXPIRATION_DATA_TYPE } from '@tools/consts/ExpirationConsts';

export default class ExpirationDataAccessor extends DataAccessorBase<ExpirationRecord> {
  constructor() {
    super(ExpirationDataAccessor.getTableName(), EXPIRATION_DATA_TYPE);
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
