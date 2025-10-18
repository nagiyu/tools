import { RecordTypeBase } from '@common/interfaces/record/RecordTypeBase';

/**
 * Notification Setting Record interface for DynamoDB
 * Extends RecordTypeBase for standard DynamoDB fields
 */
export interface NotificationSettingRecord extends RecordTypeBase {
  TerminalID: string;            // TerminalID（IDと同じ値）
  Enabled: boolean;              // 通知有効/無効
  NotificationHour: number;      // 通知時間 (0-23)
  Timezone: string;              // タイムゾーン (例: "Asia/Tokyo")
}
