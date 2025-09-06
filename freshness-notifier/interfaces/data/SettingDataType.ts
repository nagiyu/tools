import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';

export interface SettingDataType extends DataTypeBase {
  terminalId: string; // 端末を判別するためのID
  subscriptionEndpoint: string;
  subscriptionKeysP256dh: string;
  subscriptionKeysAuth: string;
  notificationEnabled: boolean; // 通知可否
  notificationTime: number; // 通知タイミング（バッチ実行するタイミング。時間指定で、分は不要）
}