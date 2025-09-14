import { ExchangeSessionType } from '@finance/types/ExchangeTypes';
import { FinanceNotificationFrequencyType } from '@finance/types/FinanceNotificationType';

/**
 * Condition with frequency configuration
 */
export interface FinanceNotificationCondition {
  /**
   * Condition name
   */
  conditionName: string;

  /**
   * Frequency setting for the condition
   */
  frequency: FinanceNotificationFrequencyType;

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
