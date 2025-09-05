import DataAccessorBase from '@common/services/DataAccessorBase';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';
import { FreshnessRecordType } from '../interfaces/record/FreshnessRecordType';

export default class FreshnessDataAccessor extends DataAccessorBase<FreshnessRecordType> {
  public constructor() {
    super(FreshnessDataAccessor.getFreshnessNotifierTableName(), 'Freshness');
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