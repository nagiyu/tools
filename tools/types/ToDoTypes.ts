import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';
import { RecordTypeBase } from '@common/interfaces/record/RecordTypeBase';

/**
 * Priority levels for ToDo items
 * Must: 必須タスク
 * Should: 推奨タスク
 * Could: 可能なら実施するタスク
 */
export const PRIORITY_LEVELS = ['Must', 'Should', 'Could'] as const;
export type PriorityType = typeof PRIORITY_LEVELS[number];

/**
 * ToDo Record interface for DynamoDB
 * Extends RecordTypeBase for standard DynamoDB fields
 */
export interface ToDoRecord extends RecordTypeBase {
  ID: string;                    // PK: UUID（ToDo固有のID）
  DataType: string;              // SK: "ToDo"
  TerminalID: string;            // TerminalID（デバイス識別子）
  Title: string;                 // ToDoタイトル
  DueDate: string;               // 期日 (YYYY-MM-DD形式)
  Priority: PriorityType;        // 優先度
  Create: number;                // 作成日時 (Unixタイムスタンプ)
  Update: number;                // 更新日時 (Unixタイムスタンプ)
}

/**
 * ToDo Data interface for application layer
 * Extends DataTypeBase for standard application fields
 */
export interface ToDoData extends DataTypeBase {
  id: string;
  terminalId: string;            // TerminalID（フロントエンドで必要）
  title: string;
  dueDate: string;               // YYYY-MM-DD形式
  priority: PriorityType;        // 'Must' | 'Should' | 'Could'
  createdAt: string;             // ISO 8601形式
  updatedAt: string;             // ISO 8601形式
  create: number;                // Unixタイムスタンプ
  update: number;                // Unixタイムスタンプ
}

/**
 * Notification Setting Record interface for DynamoDB
 * Extends RecordTypeBase for standard DynamoDB fields
 */
export interface NotificationSettingRecord extends RecordTypeBase {
  ID: string;                    // PK: TerminalID（通知設定の識別にTerminalIDを使用）
  DataType: string;              // SK: "NotificationSetting"
  TerminalID: string;            // TerminalID（IDと同じ値）
  Enabled: boolean;              // 通知有効/無効
  NotificationHour: number;      // 通知時間 (0-23)
  Timezone: string;              // タイムゾーン (例: "Asia/Tokyo")
  Create: number;                // 作成日時 (Unixタイムスタンプ)
  Update: number;                // 更新日時 (Unixタイムスタンプ)
}

/**
 * Notification Setting Data interface for application layer
 * Extends DataTypeBase for standard application fields
 */
export interface NotificationSettingData extends DataTypeBase {
  id: string;
  terminalId: string;
  enabled: boolean;
  notificationHour: number;      // 0-23
  timezone: string;              // 例: "Asia/Tokyo"
  createdAt: string;             // ISO 8601形式
  updatedAt: string;             // ISO 8601形式
  create: number;                // Unixタイムスタンプ
  update: number;                // Unixタイムスタンプ
}
