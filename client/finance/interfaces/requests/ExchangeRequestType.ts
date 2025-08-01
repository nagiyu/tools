import { TimeType } from '@common/interfaces/TimeType';

export interface CreateExchangeRequestType {
  name: string;
  start: TimeType;
  end: TimeType;
}

export interface UpdateExchangeRequestType {
  name: string;
  start: TimeType;
  end: TimeType;
  create: number;
}
