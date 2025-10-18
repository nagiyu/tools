/**
 * Expiration Manager Type Definitions
 * 
 * This file contains type definitions for the Freshness Manager (Expiration Manager) tool.
 * It defines both the data layer types used in the application and the DynamoDB record types.
 */

import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';
import { RecordTypeBase } from '@common/interfaces/record/RecordTypeBase';

/**
 * ExpirationData - Data layer interface
 * 
 * Used by client components and business logic for managing expiration data.
 * This represents food/product expiration information.
 * 
 * Inherits from DataTypeBase: id, create, update
 */
export interface ExpirationData extends DataTypeBase {
  terminalId: string;      // TerminalID (device identifier)
  title: string;           // Product title
  expirationDate: string;  // Expiration date (YYYY-MM-DD format)
  memo?: string;           // Optional memo
}

/**
 * ExpirationRecord - DynamoDB record interface
 * 
 * This is the actual record type stored in DynamoDB.
 * Field names follow DynamoDB naming conventions (PascalCase).
 * 
 * Inherits from RecordTypeBase: ID, DataType, Create, Update (made required)
 */
export interface ExpirationRecord extends RecordTypeBase {
  ID: string;              // UID, Partition Key
  DataType: string;        // 'Expiration', Sort Key
  TerminalID: string;      // TerminalID
  Title: string;           // Product title
  ExpirationDate: string;  // Expiration date (YYYY-MM-DD)
  Memo?: string;           // Optional memo
  Create: number;          // Creation timestamp
  Update: number;          // Update timestamp
}

/**
 * ExpirationSettingsData - Settings data layer interface
 * 
 * Used for managing user notification settings.
 * 
 * Inherits from DataTypeBase: id, create, update
 */
export interface ExpirationSettingsData extends DataTypeBase {
  terminalId: string;      // TerminalID
  notificationHour: number; // Notification time (0-23)
  daysBeforeNotify: number; // Days before expiration to notify (default: 3)
}

/**
 * ExpirationSettingsRecord - Settings DynamoDB record interface
 * 
 * DynamoDB record type for expiration settings.
 * 
 * Inherits from RecordTypeBase: ID, DataType, Create, Update (made required)
 */
export interface ExpirationSettingsRecord extends RecordTypeBase {
  ID: string;              // UID, Partition Key
  DataType: string;        // 'ExpirationSettings', Sort Key
  TerminalID: string;      // TerminalID
  NotificationHour: number; // Notification time (0-23)
  DaysBeforeNotify: number; // Days before expiration to notify
  Create: number;          // Creation timestamp
  Update: number;          // Update timestamp
}
