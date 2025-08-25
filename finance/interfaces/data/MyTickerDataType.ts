import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';

export interface MyTickerDataType extends DataTypeBase {
  userId: string;
  exchangeId: string;
  tickerId: string;
  purchaseDate: Date;
  purchasePrice: number;
  quantity: number;
  sellDate: Date | null;
  sellPrice: number | null;
}
