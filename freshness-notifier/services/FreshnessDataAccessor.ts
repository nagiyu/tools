import FreshnessNotifierDataAccessor from '@freshness-notifier/services/FreshnessNotifierDataAccessor';
import { FreshnessRecordType } from '@freshness-notifier/interfaces/record/FreshnessRecordType';

export default class FreshnessDataAccessor extends FreshnessNotifierDataAccessor<FreshnessRecordType> {
  public constructor() {
    super('Freshness');
  }
}