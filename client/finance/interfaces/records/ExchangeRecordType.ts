import { FinanceRecordTypeBase } from '@/interfaces/records/FinanceRecordTypeBase';

export interface ExchangeRecordType extends FinanceRecordTypeBase {
  DataType: 'Exchange';
  Name: string;
  Start: string;
  End: string;
}
