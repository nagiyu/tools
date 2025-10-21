/**
 * NotificationSettingAccessor
 * 
 * Provides DynamoDB access for notification settings data.
 * Extends DataAccessorBase to provide CRUD operations for NotificationSettingRecord.
 */

import DataAccessorBase from '@common/services/DataAccessorBase';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';
import { NotificationSettingRecord } from '@tools/interfaces/NotificationSettingRecord';
import { NOTIFICATION_SETTING_DATA_TYPE } from '@tools/consts/NotificationSettingConsts';

export default class NotificationSettingAccessor extends DataAccessorBase<NotificationSettingRecord> {
  constructor() {
    super(NotificationSettingAccessor.getTableName(), NOTIFICATION_SETTING_DATA_TYPE);
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

  /**
   * Get notification setting by TerminalID
   * Retrieves notification setting for a specific device/terminal
   * 
   * @param terminalId - The TerminalID to filter by
   * @returns Promise<NotificationSettingRecord | null> - Notification setting record for the specified terminal or null if not found
   */
  public async getByTerminalId(terminalId: string): Promise<NotificationSettingRecord | null> {
    const allRecords = await this.get();
    const filtered = allRecords.filter(record => record.TerminalID === terminalId);
    return filtered.length > 0 ? filtered[0] : null;
  }
}
