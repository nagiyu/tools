import FreshnessNotifierDataAccessor from './FreshnessNotifierDataAccessor';
import { FreshnessRecordType } from '../interfaces/record/FreshnessRecordType';

export default class FreshnessDataAccessor extends FreshnessNotifierDataAccessor<FreshnessRecordType> {
  public constructor() {
    super('Freshness');
  }
}