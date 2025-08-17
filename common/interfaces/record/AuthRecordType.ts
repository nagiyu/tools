import { RecordTypeBase } from '@common/aws/interfaces/DynamoDB/RecordTypeBase';

export interface AuthRecordType extends RecordTypeBase {
  DataType: 'Auth';
  GoogleUserID: string;
}
