import { TimeType } from '@common/interfaces/TimeType';

export interface ExchangeDataType {
  id: string;
  name: string;
  start: TimeType;
  end: TimeType;
  create: number;
  update: number;
}
