import CRUDServiceBase from '@common/services/CRUDServiceBase.old';
import FreshnessDataAccessor from '@freshness-notifier/services/FreshnessDataAccessor';
import { FreshnessDataType } from '@freshness-notifier/interfaces/data/FreshnessDataType';
import { FreshnessRecordType } from '@freshness-notifier/interfaces/record/FreshnessRecordType';

export default class FreshnessDataService extends CRUDServiceBase<FreshnessDataType, FreshnessRecordType> {
  public constructor() {
    super(
      new FreshnessDataAccessor(),
      FreshnessDataService.dataToRecord,
      FreshnessDataService.recordToData
    );
  }

  public async getById(id: string): Promise<FreshnessDataType | null> {
    const items = await this.get();
    return items.find(item => item.id === id) || null;
  }

  private static dataToRecord(data: FreshnessDataType): FreshnessRecordType {
    return {
      ID: data.id,
      DataType: 'Freshness',
      Name: data.name,
      ExpiryDate: data.expiryDate,
      NotificationEnabled: data.notificationEnabled,
      Create: data.create,
      Update: data.update,
    };
  }

  private static recordToData(record: FreshnessRecordType): FreshnessDataType {
    return {
      id: record.ID,
      name: record.Name,
      expiryDate: record.ExpiryDate,
      notificationEnabled: record.NotificationEnabled,
      create: record.Create,
      update: record.Update,
    };
  }
}