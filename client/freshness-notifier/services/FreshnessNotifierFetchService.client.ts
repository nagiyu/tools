import FetchServiceBase from '@client-common/services/FetchServiceBase.client';
import { FreshnessDataType } from '@freshness-notifier/interfaces/data/FreshnessDataType';

export default class FreshnessNotifierFetchService extends FetchServiceBase<FreshnessDataType> {
  public constructor() {
    super('/api/freshness');
  }
}