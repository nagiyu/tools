import { FinanceNotificationFrequencyType } from '@finance/types/FinanceNotificationType';

/**
 * Condition with frequency configuration
 */
export interface FinanceNotificationConditionWithFrequency {
  /**
   * Condition name
   */
  conditionName: string;

  /**
   * Frequency setting for the condition
   */
  frequency: FinanceNotificationFrequencyType;
}
