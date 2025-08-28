import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';
import { FinanceNotificationConditionType, FinanceNotificationTimeFrameType } from '@finance/types/FinanceNotificationType';

export interface FinanceNotificationDataType extends DataTypeBase {
  terminalId: string;
  subscriptionEndpoint: string;
  subscriptionKeysP256dh: string;
  subscriptionKeysAuth: string;
  exchangeId: string;
  tickerId: string;
  conditionType: FinanceNotificationConditionType;
  conditionValue: number;
  timeFrame: FinanceNotificationTimeFrameType;
}
