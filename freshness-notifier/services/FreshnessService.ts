import FreshnessNotifierService from './FreshnessNotifierService';
import FreshnessNotifierDataAccessor from './FreshnessNotifierDataAccessor';
import { FreshnessDataType } from '../interfaces/data/FreshnessDataType';
import { FreshnessRecordType } from '../interfaces/record/FreshnessRecordType';

export default class FreshnessService extends FreshnessNotifierService<FreshnessDataType, FreshnessRecordType> {
  public constructor() {
    super(
      new FreshnessNotifierDataAccessor<FreshnessRecordType>('Freshness'),
      FreshnessService.dataToRecord,
      FreshnessService.recordToData
    );
  }

  private static dataToRecord(data: FreshnessDataType): FreshnessRecordType {
    return FreshnessNotifierService.freshnessDataToRecord(data);
  }

  private static recordToData(record: FreshnessRecordType): FreshnessDataType {
    return FreshnessNotifierService.freshnessRecordToData(record);
  }
}