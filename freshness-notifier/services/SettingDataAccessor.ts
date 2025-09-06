import FreshnessNotifierDataAccessor from '@freshness-notifier/services/FreshnessNotifierDataAccessor';
import { SettingRecordType } from '@freshness-notifier/interfaces/record/SettingRecordType';

export default class SettingDataAccessor extends FreshnessNotifierDataAccessor<SettingRecordType> {
  public constructor() {
    super('Setting');
  }
}