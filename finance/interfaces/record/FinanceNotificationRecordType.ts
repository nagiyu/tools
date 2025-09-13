import { ExchangeSessionType } from '@finance/types/ExchangeTypes';
import { FinanceNotificationConditionWithFrequency } from '@finance/interfaces/FinanceNotificationType';
import { FinanceRecordTypeBase } from '@finance/interfaces/record/FinanceRecordTypeBase';
import { FINANCE_RECORD_DATA_TYPE } from '@finance/types/FinanceRecordDataType';

export interface FinanceNotificationRecordType extends FinanceRecordTypeBase {
  DataType: typeof FINANCE_RECORD_DATA_TYPE.FINANCE_NOTIFICATION;
  TerminalID: string;
  SubscriptionEndpoint: string;
  SubscriptionKeysP256dh: string;
  SubscriptionKeysAuth: string;
  ExchangeID: string;
  TickerID: string;

  /**
   * List of conditions with frequency settings
   */
  ConditionList: FinanceNotificationConditionWithFrequency[];

  /**
   * Session type for price data
   */
  Session?: ExchangeSessionType;

  /**
   * Target price for conditions that require it (e.g., GreaterThan, LessThan)
   */
  TargetPrice?: number;

  /**
   * First notification flag for pattern conditions
   */
  FirstNotificationSent: boolean;
}
