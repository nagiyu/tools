import FetchServiceBase from '@client-common/services/FetchServiceBase';

import { MyTickerDataType } from '@finance/interfaces/data/MyTickerDataType';

export default class MyTickerFetchService extends FetchServiceBase<MyTickerDataType> {
  public constructor() {
    super('/api/myticker');
  }
}
