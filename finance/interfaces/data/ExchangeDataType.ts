import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';
import { TimeType } from '@common/interfaces/TimeType';

export interface ExchangeDataType extends DataTypeBase {
  name: string;
  key: string;
  start: TimeType;
  end: TimeType;
}