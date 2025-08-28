import { RecordTypeBase } from '@common/aws/interfaces/DynamoDB/RecordTypeBase';

export interface ExchangeRecordType extends RecordTypeBase {
  DataType: 'Exchange';
  Name: string;
  Key: string;
  Start: string;
  End: string;
}