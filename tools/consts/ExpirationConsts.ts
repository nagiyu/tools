/**
 * Expiration Manager Constants
 * 
 * This file contains constant values used throughout the Expiration Manager tool.
 */

/**
 * DynamoDB DataType values
 */
export const EXPIRATION_DATA_TYPE = 'Expiration';
export const EXPIRATION_SETTINGS_DATA_TYPE = 'ExpirationSettings';

/**
 * Default settings values
 */
export const DEFAULT_NOTIFICATION_HOUR = 9;        // 9 AM
export const DEFAULT_DAYS_BEFORE_NOTIFY = 3;       // 3 days before expiration

/**
 * Validation constraints
 */
export const MAX_TITLE_LENGTH = 100;
export const MAX_MEMO_LENGTH = 500;
export const MIN_NOTIFICATION_HOUR = 0;
export const MAX_NOTIFICATION_HOUR = 23;
export const MIN_DAYS_BEFORE_NOTIFY = 0;
export const MAX_DAYS_BEFORE_NOTIFY = 365;

/**
 * Date format
 */
export const DATE_FORMAT = 'YYYY-MM-DD';
