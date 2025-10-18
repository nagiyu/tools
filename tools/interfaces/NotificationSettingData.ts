import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';

/**
 * Notification Setting Data interface for application layer
 * Extends DataTypeBase for standard application fields
 */
export interface NotificationSettingData extends DataTypeBase {
  terminalId: string;
  enabled: boolean;
  notificationHour: number;      // 0-23
  timezone: string;              // 例: "Asia/Tokyo"
}
