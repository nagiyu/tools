import AuthorizeUtil from '@common/utils/AuthorizeUtil';

import AuthUtil from '@client-common/auth/AuthUtil';

import { FinanceAuthRecordType } from '@/interfaces/records/FinanceAuthRecordType';

export default class FinanceAuthorizer {
  private static readonly feature = 'Finance';

  public static async isAdmin(): Promise<boolean> {
    const googleUserID = await AuthUtil.getGoogleUserIdFromSession();
    return AuthorizeUtil.isAuthorizedByGoogleUserID<FinanceAuthRecordType>(googleUserID, this.feature, ['Admin']);
  }

  public static async isUser(): Promise<boolean> {
    const googleUserID = await AuthUtil.getGoogleUserIdFromSession();
    return AuthorizeUtil.isAuthorizedByGoogleUserID<FinanceAuthRecordType>(googleUserID, this.feature);
  }
}
