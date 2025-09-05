import CRUDServiceBase from '@common/services/CRUDServiceBase';
import FreshnessNotifierDataAccessor from './FreshnessNotifierDataAccessor';
import { FreshnessDataType } from '../interfaces/data/FreshnessDataType';
import { SettingDataType } from '../interfaces/data/SettingDataType';
import { FreshnessRecordType } from '../interfaces/record/FreshnessRecordType';
import { SettingRecordType } from '../interfaces/record/SettingRecordType';
import { FreshnessNotifierRecordTypeBase } from '../interfaces/record/FreshnessNotifierRecordTypeBase';

export default class FreshnessNotifierService<
  DataType extends FreshnessDataType | SettingDataType,
  RecordType extends FreshnessNotifierRecordTypeBase
> extends CRUDServiceBase<DataType, RecordType> {
  public constructor(
    dataAccessor: FreshnessNotifierDataAccessor<RecordType>,
    dataToRecord: (data: DataType) => RecordType,
    recordToData: (record: RecordType) => DataType
  ) {
    super(dataAccessor, dataToRecord, recordToData);
  }

  // Static helper methods for Freshness data conversion
  protected static freshnessDataToRecord(data: FreshnessDataType): FreshnessRecordType {
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

  protected static freshnessRecordToData(record: FreshnessRecordType): FreshnessDataType {
    return {
      id: record.ID,
      name: record.Name,
      expiryDate: record.ExpiryDate,
      notificationEnabled: record.NotificationEnabled,
      create: record.Create,
      update: record.Update,
    };
  }

  // Static helper methods for Setting data conversion
  protected static settingDataToRecord(data: SettingDataType): SettingRecordType {
    return {
      ID: data.id,
      DataType: 'Setting',
      TerminalId: data.terminalId,
      SubscriptionEndpoint: data.subscriptionEndpoint,
      SubscriptionKeysP256dh: data.subscriptionKeysP256dh,
      SubscriptionKeysAuth: data.subscriptionKeysAuth,
      NotificationEnabled: data.notificationEnabled,
      NotificationTime: data.notificationTime,
      Create: data.create,
      Update: data.update,
    };
  }

  protected static settingRecordToData(record: SettingRecordType): SettingDataType {
    return {
      id: record.ID,
      terminalId: record.TerminalId,
      subscriptionEndpoint: record.SubscriptionEndpoint,
      subscriptionKeysP256dh: record.SubscriptionKeysP256dh,
      subscriptionKeysAuth: record.SubscriptionKeysAuth,
      notificationEnabled: record.NotificationEnabled,
      notificationTime: record.NotificationTime,
      create: record.Create,
      update: record.Update,
    };
  }
}