import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';
import { FinanceNotificationConditionType, FinanceNotificationTimeFrameType, FinanceNotificationModeType, FinanceNotificationFrequencyType } from '@finance/types/FinanceNotificationType';

export interface FinanceNotificationDataType extends DataTypeBase {
  terminalId: string;
  subscriptionEndpoint: string;
  subscriptionKeysP256dh: string;
  subscriptionKeysAuth: string;
  exchangeId: string;
  tickerId: string;
  // Legacy single condition support (for backward compatibility)
  conditionType: FinanceNotificationConditionType;
  conditionValue: number;
  // New multi-condition support
  mode?: FinanceNotificationModeType;
  conditions?: string; // JSON-stringified array of conditions (legacy: string[], new: {type: string, frequency: string}[])
  timeFrame: FinanceNotificationTimeFrameType;
  // Session type for price data (regular/extended)
  session?: string;
  // Notification frequency control (legacy - for backward compatibility)
  frequency?: FinanceNotificationFrequencyType;
  // First notification flag for pattern conditions
  firstNotificationSent?: boolean;
}
