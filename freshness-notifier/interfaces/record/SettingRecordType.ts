import { FreshnessNotifierRecordTypeBase } from '@freshness-notifier/interfaces/record/FreshnessNotifierRecordTypeBase';

export interface SettingRecordType extends FreshnessNotifierRecordTypeBase {
  DataType: 'Setting';
  TerminalId: string;
  SubscriptionEndpoint: string;
  SubscriptionKeysP256dh: string;
  SubscriptionKeysAuth: string;
  NotificationEnabled: boolean;
  NotificationTime: number;
}