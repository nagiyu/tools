import FreshnessNotifierDataAccessor from './FreshnessNotifierDataAccessor';
import { SettingRecordType } from '../interfaces/record/SettingRecordType';

export default class SettingDataAccessor extends FreshnessNotifierDataAccessor<SettingRecordType> {
  public constructor() {
    super('Setting');
  }
}