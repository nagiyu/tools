import CacheUtil from '@common/utils/CacheUtil';
import CommonUtil from '@common/utils/CommonUtil';
import DataAccessorBase from '@common/services/DataAccessorBase';
import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';
import { RecordTypeBase } from '@common/aws/interfaces/DynamoDB/RecordTypeBase';

export default abstract class CRUDServiceBase<DataType extends DataTypeBase, RecordType extends RecordTypeBase> {
  private readonly dataAccessor: DataAccessorBase<RecordType>;
  private readonly dataToRecord: (data: DataType) => RecordType;
  private readonly recordToData: (record: RecordType) => DataType;
  private readonly cacheKey = CommonUtil.generateUUID();

  protected constructor(dataAccessor: DataAccessorBase<RecordType>, dataToRecord: (data: DataType) => RecordType, recordToData: (record: RecordType) => DataType) {
    this.dataAccessor = dataAccessor;
    this.dataToRecord = dataToRecord;
    this.recordToData = recordToData;
  }

  public async get(useCache: boolean = false): Promise<DataType[]> {
    if (useCache) {
      const cachedData = CacheUtil.get<DataType[]>(this.cacheKey);

      if (cachedData) {
        return cachedData;
      }
    }

    const data = await this.dataAccessor.get();
    const mappedData = data.map(this.recordToData);

    if (useCache) {
      CacheUtil.set(this.cacheKey, mappedData);
    }

    return mappedData;
  }

  public async create(item: DataType): Promise<void> {
    await this.dataAccessor.create(this.dataToRecord(item));
  }

  public async update(item: DataType): Promise<void> {
    await this.dataAccessor.update(this.dataToRecord(item));
  }

  public async delete(id: string): Promise<void> {
    await this.dataAccessor.delete(id);
  }
}
