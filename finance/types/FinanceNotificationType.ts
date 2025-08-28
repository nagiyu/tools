export const FINANCE_NOTIFICATION_CONDITION_TYPE = {
  GREATER_THAN: 'GreaterThan',
  LESS_THAN: 'LessThan',
} as const;

export type FinanceNotificationConditionType = typeof FINANCE_NOTIFICATION_CONDITION_TYPE[keyof typeof FINANCE_NOTIFICATION_CONDITION_TYPE];

export const FINANCE_NOTIFICATION_TIME_FRAME = {
  ONE_MINUTE: '1',
} as const;

export type FinanceNotificationTimeFrameType = typeof FINANCE_NOTIFICATION_TIME_FRAME[keyof typeof FINANCE_NOTIFICATION_TIME_FRAME];
