import DataAccessorBase from '@common/services/DataAccessorBase';

import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';
import { FinanceRecordTypeBase } from '@finance/interfaces/record/FinanceRecordTypeBase';

export default abstract class FinanceDataAccessorBase<T extends FinanceRecordTypeBase> extends DataAccessorBase<T> {
  public constructor(dataType: string) {
    super(FinanceDataAccessorBase.getFinanceTableName(), dataType);
  }

  private static getFinanceTableName(): string {
    switch (EnvironmentalUtil.GetProcessEnv()) {
      case 'local':
      case 'development':
        return 'DevFinance';
      case 'production':
        return 'Finance';
      default:
        return 'DevFinance';
    }
  }
}
