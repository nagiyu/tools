import CRUDServiceBase from '@common/services/CRUDServiceBase';
import FreshnessNotifierDataAccessor from './FreshnessNotifierDataAccessor';
import { FreshnessDataType } from '../interfaces/data/FreshnessDataType';
import { FreshnessRecordType } from '../interfaces/record/FreshnessRecordType';

export default class FreshnessDataService extends CRUDServiceBase<FreshnessDataType, FreshnessRecordType> {
  public constructor() {
    super(
      new FreshnessNotifierDataAccessor<FreshnessRecordType>('Freshness'),
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