import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';

export interface FreshnessDataType extends DataTypeBase {
  name: string;
  expiryDate: string; // 賞味期限（年月日まで）
  notificationEnabled: boolean; // 通知可否
}