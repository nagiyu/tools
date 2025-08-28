import { RecordTypeBase } from '@common/aws/interfaces/DynamoDB/RecordTypeBase';

export interface TickerRecordType extends RecordTypeBase {
  DataType: 'Ticker';
  Name: string;
  Key: string;
  Exchange: string;
}