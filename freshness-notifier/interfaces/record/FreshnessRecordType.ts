import { FreshnessNotifierRecordTypeBase } from './FreshnessNotifierRecordTypeBase';

export interface FreshnessRecordType extends FreshnessNotifierRecordTypeBase {
  DataType: 'Freshness';
  Name: string;
  ExpiryDate: string;
  NotificationEnabled: boolean;
}