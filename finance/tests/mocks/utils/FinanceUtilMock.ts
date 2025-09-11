import { GetStockPriceDataOptions } from '@finance/utils/FinanceUtil';

export default class FinanceUtilMock {
  public static StockPriceDataMock: any[] = [];

  public static async getStockPriceData(exchange: string, ticker: string, options?: GetStockPriceDataOptions): Promise<any> {
    return this.StockPriceDataMock;
  }
}
