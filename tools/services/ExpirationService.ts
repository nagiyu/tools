/**
 * ExpirationService
 * 
 * Business logic service for managing expiration data.
 * Extends CRUDServiceBase to provide CRUD operations with data transformation.
 */

import CRUDServiceBase from '@common/services/CRUDServiceBase';
import ExpirationDataAccessor from '@tools/accessors/ExpirationDataAccessor';
import { ExpirationData, ExpirationRecord } from '@tools/types/ExpirationTypes';

export default class ExpirationService extends CRUDServiceBase<ExpirationData, ExpirationRecord> {
  constructor() {
    super(new ExpirationDataAccessor(), true);
  }

  /**
   * Convert ExpirationData to ExpirationRecord for DynamoDB
   * @param data Partial ExpirationData
   * @returns Partial ExpirationRecord
   */
  protected dataToRecord(data: Partial<ExpirationData>): Partial<ExpirationRecord> {
    const record: Partial<ExpirationRecord> = {};

    if (data.id !== undefined) record.ID = data.id;
    if (data.terminalId !== undefined) record.TerminalID = data.terminalId;
    if (data.title !== undefined) record.Title = data.title;
    if (data.expirationDate !== undefined) record.ExpirationDate = data.expirationDate;
    if (data.memo !== undefined) record.Memo = data.memo;
    if (data.create !== undefined) record.Create = data.create;
    if (data.update !== undefined) record.Update = data.update;

    return record;
  }

  /**
   * Convert ExpirationRecord from DynamoDB to ExpirationData
   * @param record ExpirationRecord
   * @returns ExpirationData
   */
  protected recordToData(record: ExpirationRecord): ExpirationData {
    return {
      id: record.ID || '',
      terminalId: record.TerminalID || '',
      title: record.Title || '',
      expirationDate: record.ExpirationDate || '',
      memo: record.Memo,
      create: record.Create || 0,
      update: record.Update || 0,
    };
  }
}
