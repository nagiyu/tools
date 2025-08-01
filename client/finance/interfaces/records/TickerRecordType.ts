import { FinanceRecordTypeBase } from '@/interfaces/records/FinanceRecordTypeBase';

export interface TickerRecordType extends FinanceRecordTypeBase {
  DataType: 'Ticker';
}
