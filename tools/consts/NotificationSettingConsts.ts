/**
 * Notification Settings Constants
 * 
 * This file contains constant values used for ToDo notification settings.
 */

/**
 * DynamoDB DataType value
 */
export const NOTIFICATION_SETTING_DATA_TYPE = 'NotificationSetting';

/**
 * Default settings values
 */
export const DEFAULT_NOTIFICATION_ENABLED = false;
export const DEFAULT_NOTIFICATION_HOUR = 9;        // 9 AM
export const DEFAULT_TIMEZONE = 'Asia/Tokyo';

/**
 * Validation constraints
 */
export const MIN_NOTIFICATION_HOUR = 0;
export const MAX_NOTIFICATION_HOUR = 23;
