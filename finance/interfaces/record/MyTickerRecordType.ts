import { FinanceRecordTypeBase } from '@finance/interfaces/record/FinanceRecordTypeBase';

export interface MyTickerRecordType extends FinanceRecordTypeBase {
  DataType: 'MyTicker';
  UserID: string;
  ExchangeID: string;
  TickerID: string;
  PurchaseDate: number;
  PurchasePrice: number;
  Quantity: number;
  SellDate: number | null;
  SellPrice: number | null;
}
