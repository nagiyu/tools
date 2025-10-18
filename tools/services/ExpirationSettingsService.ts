/**
 * ExpirationSettingsService
 * 
 * Business logic service for managing expiration settings data.
 * Extends CRUDServiceBase to provide CRUD operations with data transformation.
 */

import CRUDServiceBase from '@common/services/CRUDServiceBase';
import ExpirationSettingsAccessor from '@tools/accessors/ExpirationSettingsAccessor';
import { ExpirationSettingsData, ExpirationSettingsRecord } from '@tools/types/ExpirationTypes';

export default class ExpirationSettingsService extends CRUDServiceBase<ExpirationSettingsData, ExpirationSettingsRecord> {
  constructor() {
    super(new ExpirationSettingsAccessor(), true);
  }

  /**
   * Convert ExpirationSettingsData to ExpirationSettingsRecord for DynamoDB
   * @param data Partial ExpirationSettingsData
   * @returns Partial ExpirationSettingsRecord
   */
  protected dataToRecord(data: Partial<ExpirationSettingsData>): Partial<ExpirationSettingsRecord> {
    const record: Partial<ExpirationSettingsRecord> = {};

    if (data.id !== undefined) record.ID = data.id;
    if (data.terminalId !== undefined) record.TerminalID = data.terminalId;
    if (data.notificationHour !== undefined) record.NotificationHour = data.notificationHour;
    if (data.daysBeforeNotify !== undefined) record.DaysBeforeNotify = data.daysBeforeNotify;
    if (data.create !== undefined) record.Create = data.create;
    if (data.update !== undefined) record.Update = data.update;

    return record;
  }

  /**
   * Convert ExpirationSettingsRecord from DynamoDB to ExpirationSettingsData
   * @param record ExpirationSettingsRecord
   * @returns ExpirationSettingsData
   */
  protected recordToData(record: ExpirationSettingsRecord): ExpirationSettingsData {
    return {
      id: record.ID || '',
      terminalId: record.TerminalID || '',
      notificationHour: record.NotificationHour || 0,
      daysBeforeNotify: record.DaysBeforeNotify || 0,
      create: record.Create || 0,
      update: record.Update || 0,
    };
  }
}
