/**
 * Expiration Manager Type Definitions
 * 
 * This file contains type definitions for the Freshness Manager (Expiration Manager) tool.
 * It defines both the data layer types used in the application and the DynamoDB record types.
 */

/**
 * Base interface for data types
 * Used for client and business logic layer
 */
export interface DataTypeBase {
  id: string;
  terminalId: string;
  create: number;
  update: number;
}

/**
 * Base interface for DynamoDB record types
 * Used for data access layer
 */
export interface RecordTypeBase {
  ID: string;
  DataType: string;
  TerminalID: string;
  Create: number;
  Update: number;
}

/**
 * ExpirationData - Data layer interface
 * 
 * Used by client components and business logic for managing expiration data.
 * This represents food/product expiration information.
 */
export interface ExpirationData extends DataTypeBase {
  id: string;              // UID (auto-generated)
  terminalId: string;      // TerminalID (device identifier)
  title: string;           // Product title
  expirationDate: string;  // Expiration date (YYYY-MM-DD format)
  memo?: string;           // Optional memo
  create: number;          // Creation timestamp (Unix timestamp)
  update: number;          // Update timestamp (Unix timestamp)
}

/**
 * ExpirationRecord - DynamoDB record interface
 * 
 * This is the actual record type stored in DynamoDB.
 * Field names follow DynamoDB naming conventions (PascalCase).
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
 */
export interface ExpirationSettingsData extends DataTypeBase {
  id: string;              // UID (based on TerminalID)
  terminalId: string;      // TerminalID
  notificationHour: number; // Notification time (0-23)
  daysBeforeNotify: number; // Days before expiration to notify (default: 3)
  create: number;          // Creation timestamp
  update: number;          // Update timestamp
}

/**
 * ExpirationSettingsRecord - Settings DynamoDB record interface
 * 
 * DynamoDB record type for expiration settings.
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
