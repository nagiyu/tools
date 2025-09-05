import { RecordTypeBase } from '@common/aws/interfaces/DynamoDB/RecordTypeBase';

export interface FreshnessNotifierRecordTypeBase extends RecordTypeBase {
  DataType: 'Freshness' | 'Setting';
}