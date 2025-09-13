import CommonUtil from '@common/utils/CommonUtil';
import DataAccessorBase from '@common/services/DataAccessorBase';
import DynamoDBServiceMock from '@common/tests/mock/services/aws/DynamoDBServiceMock';
import ErrorUtil from '@common/utils/ErrorUtil';
import { RecordTypeBase } from '@common/interfaces/record/RecordTypeBase';

const tableName = 'Test';

const TEST_RECORD_DATA_TYPE = {
  TYPEA: 'TypeA',
  TYPEB: 'TypeB',
} as const;

interface TestRecordType extends RecordTypeBase {
  DataType: typeof TEST_RECORD_DATA_TYPE.TYPEA;
  StringColumn: string;
  NumberColumn: number;
  OptionalStringColumn?: string;
  OptionalNumberColumn?: number;
}

const generateTypeARecord = (): TestRecordType => {
  return {
    DataType: TEST_RECORD_DATA_TYPE.TYPEA,
    StringColumn: 'stringA',
    NumberColumn: 123,
  };
}

class TestDataAccessor extends DataAccessorBase<TestRecordType> {
  constructor() {
    super(tableName, TEST_RECORD_DATA_TYPE.TYPEA, new DynamoDBServiceMock(tableName));
  }
}

describe('DataAccessorBase', () => {
  let dataAccessor: TestDataAccessor;

  beforeEach(() => {
    dataAccessor = new TestDataAccessor();
  });

  it('Get Table Name', () => {
    expect(dataAccessor.getTableName()).toBe(tableName);
  });

  it('Get', async () => {
    const item1 = await dataAccessor.create(generateTypeARecord());
    const item2 = await dataAccessor.create(generateTypeARecord());

    const results = await dataAccessor.get();
    expect(results.length).toBe(2);
    expect(results).toEqual(expect.arrayContaining([item1, item2]));
  });

  it('CRUD', async () => {
    const createItem = await dataAccessor.create(generateTypeARecord());
    const id = createItem.ID;

    const createResult = await dataAccessor.getById(id);

    if (!createResult) {
      ErrorUtil.throwError('Create result is null');
    }

    expect(createResult.ID).toEqual(createItem.ID);
    expect(createResult.DataType).toEqual(TEST_RECORD_DATA_TYPE.TYPEA);
    expect(createResult.StringColumn).toEqual('stringA');
    expect(createResult.NumberColumn).toEqual(123);
    expect(createResult.OptionalStringColumn).toBeUndefined();
    expect(createResult.OptionalNumberColumn).toBeUndefined();
    expect(createResult.Create).toEqual(createItem.Create);
    expect(createResult.Update).toEqual(createItem.Update);

    const updateItem: Partial<TestRecordType> = {
      StringColumn: 'updated',
      NumberColumn: 456,
      OptionalStringColumn: 'optional',
      OptionalNumberColumn: 789,
    };

    const updateResult = await dataAccessor.update(id, updateItem);

    if (!updateResult) {
      ErrorUtil.throwError('Update result is null');
    }

    expect(updateResult.ID).toEqual(createItem.ID);
    expect(updateResult.DataType).toEqual(TEST_RECORD_DATA_TYPE.TYPEA);
    expect(updateResult.StringColumn).toEqual('updated');
    expect(updateResult.NumberColumn).toEqual(456);
    expect(updateResult.OptionalStringColumn).toEqual('optional');
    expect(updateResult.OptionalNumberColumn).toEqual(789);
    expect(updateResult.Create).toEqual(createItem.Create);
    expect(updateResult.Update).toBeGreaterThanOrEqual(createItem.Update);

    await dataAccessor.delete(id);

    const deleteResult = await dataAccessor.getById(id);

    expect(deleteResult).toBeNull();
  });
});
