export interface CreateTickerRequestType {
  name: string;
  key: string;
  exchange: string;
}

export interface UpdateTickerRequestType {
  name: string;
  key: string;
  exchange: string;
  create: number;
}
