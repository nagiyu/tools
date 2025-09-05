import DataAccessorBase from '@common/services/DataAccessorBase';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';
import { SettingRecordType } from '../interfaces/record/SettingRecordType';

export default class SettingDataAccessor extends DataAccessorBase<SettingRecordType> {
  public constructor() {
    super(SettingDataAccessor.getFreshnessNotifierTableName(), 'Setting');
  }

  private static getFreshnessNotifierTableName(): string {
    switch (EnvironmentalUtil.GetProcessEnv()) {
      case 'local':
      case 'development':
        return 'DevFreshnessNotifier';
      case 'production':
        return 'FreshnessNotifier';
      default:
        return 'DevFreshnessNotifier';
    }
  }
}