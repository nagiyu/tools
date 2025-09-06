import { FreshnessNotifierRecordTypeBase } from '@freshness-notifier/interfaces/record/FreshnessNotifierRecordTypeBase';

export interface FreshnessRecordType extends FreshnessNotifierRecordTypeBase {
  DataType: 'Freshness';
  Name: string;
  ExpiryDate: string;
  NotificationEnabled: boolean;
}