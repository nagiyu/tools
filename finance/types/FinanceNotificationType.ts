// Trading mode selection
export const FINANCE_NOTIFICATION_MODE = {
  BUY: 'Buy',
  SELL: 'Sell',
} as const;

export type FinanceNotificationModeType = typeof FINANCE_NOTIFICATION_MODE[keyof typeof FINANCE_NOTIFICATION_MODE];

// Individual condition types
export const FINANCE_NOTIFICATION_CONDITION_TYPE = {
  GREATER_THAN: 'GreaterThan',
  LESS_THAN: 'LessThan',
  THREE_RED_SOLDIERS: 'ThreeRedSoldiers',
  THREE_RIVER_EVENING_STAR: 'ThreeRiverEveningStar',
} as const;

export type FinanceNotificationConditionType = typeof FINANCE_NOTIFICATION_CONDITION_TYPE[keyof typeof FINANCE_NOTIFICATION_CONDITION_TYPE];

// Condition groups by mode
export const BUY_CONDITIONS = [
  FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN,
  FINANCE_NOTIFICATION_CONDITION_TYPE.THREE_RED_SOLDIERS,
  FINANCE_NOTIFICATION_CONDITION_TYPE.THREE_RIVER_EVENING_STAR,
] as const;

export const SELL_CONDITIONS = [
  FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN,
] as const;

export const FINANCE_NOTIFICATION_TIME_FRAME = {
  ONE_MINUTE: '1',
} as const;

export type FinanceNotificationTimeFrameType = typeof FINANCE_NOTIFICATION_TIME_FRAME[keyof typeof FINANCE_NOTIFICATION_TIME_FRAME];
