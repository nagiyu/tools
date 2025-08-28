import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';

export interface TickerDataType extends DataTypeBase {
  name: string;
  key: string;
  exchange: string;
}