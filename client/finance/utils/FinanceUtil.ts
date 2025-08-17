import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';

export default class FinanceUtil {
  public static getFinanceTableName(): string {
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
