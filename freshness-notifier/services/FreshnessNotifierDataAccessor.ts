import DataAccessorBase from '@common/services/DataAccessorBase.old';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';
import { FreshnessNotifierRecordTypeBase } from '@freshness-notifier/interfaces/record/FreshnessNotifierRecordTypeBase';

export default class FreshnessNotifierDataAccessor<T extends FreshnessNotifierRecordTypeBase> extends DataAccessorBase<T> {
  public constructor(dataType: 'Freshness' | 'Setting') {
    super(FreshnessNotifierDataAccessor.getFreshnessNotifierTableName(), dataType);
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