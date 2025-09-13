import { FINANCE_NOTIFICATION_FREQUENCY } from '@finance/consts/FinanceNotificationConst';

/**
 * Notification frequency control
 */
export type FinanceNotificationFrequencyType = typeof FINANCE_NOTIFICATION_FREQUENCY[keyof typeof FINANCE_NOTIFICATION_FREQUENCY];
