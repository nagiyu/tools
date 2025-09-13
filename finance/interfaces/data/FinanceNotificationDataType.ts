import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';

import { ExchangeSessionType } from '@finance/types/ExchangeTypes';
import { FinanceNotificationConditionWithFrequency } from '@finance/interfaces/FinanceNotificationType';

export interface FinanceNotificationDataType extends DataTypeBase {
  terminalId: string;
  subscriptionEndpoint: string;
  subscriptionKeysP256dh: string;
  subscriptionKeysAuth: string;
  exchangeId: string;
  tickerId: string;

  /**
   * List of conditions with frequency settings
   */
  conditionList: FinanceNotificationConditionWithFrequency[];

  /**
   * Session type for price data
   */
  session?: ExchangeSessionType;

  /**
   * Target price for conditions that require it (e.g., GreaterThan, LessThan)
   */
  targetPrice?: number;

  /**
   * Indicates if the first notification has been sent
   */
  firstNotificationSent: boolean;
}
