import FreshnessNotifierService from './FreshnessNotifierService';
import FreshnessNotifierDataAccessor from './FreshnessNotifierDataAccessor';
import { SettingDataType } from '../interfaces/data/SettingDataType';
import { SettingRecordType } from '../interfaces/record/SettingRecordType';

export default class SettingService extends FreshnessNotifierService<SettingDataType, SettingRecordType> {
  public constructor() {
    super(
      new FreshnessNotifierDataAccessor<SettingRecordType>('Setting'),
      SettingService.dataToRecord,
      SettingService.recordToData
    );
  }

  private static dataToRecord(data: SettingDataType): SettingRecordType {
    return FreshnessNotifierService.settingDataToRecord(data);
  }

  private static recordToData(record: SettingRecordType): SettingDataType {
    return FreshnessNotifierService.settingRecordToData(record);
  }

  // Additional methods specific to Setting management
  public async getByTerminalId(terminalId: string): Promise<SettingDataType | null> {
    const settings = await this.get();
    return settings.find(setting => setting.terminalId === terminalId) || null;
  }
}