import CRUDServiceBase from '@common/services/CRUDServiceBase';
import SettingDataAccessor from '@freshness-notifier/services/SettingDataAccessor';
import { SettingDataType } from '@freshness-notifier/interfaces/data/SettingDataType';
import { SettingRecordType } from '@freshness-notifier/interfaces/record/SettingRecordType';

export default class SettingDataService extends CRUDServiceBase<SettingDataType, SettingRecordType> {
  public constructor() {
    super(
      new SettingDataAccessor(),
      SettingDataService.dataToRecord,
      SettingDataService.recordToData
    );
  }

  public async getById(id: string): Promise<SettingDataType | null> {
    const items = await this.get();
    return items.find(item => item.id === id) || null;
  }

  private static dataToRecord(data: SettingDataType): SettingRecordType {
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

  private static recordToData(record: SettingRecordType): SettingDataType {
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

  // Additional methods specific to Setting management
  public async getByTerminalId(terminalId: string): Promise<SettingDataType | null> {
    const settings = await this.get();
    return settings.find(setting => setting.terminalId === terminalId) || null;
  }
}