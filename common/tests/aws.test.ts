import CommonUtil from '@common/utils/CommonUtil';
import DynamoDBService from '@common/services/aws/DynamoDBService';
import ErrorUtil from '@common/utils/ErrorUtil';
import { RecordTypeBase } from '@common/interfaces/record/RecordTypeBase';

const TEST_RECORD_DATA_TYPE = {
  TYPEA: 'TypeA',
  TYPEB: 'TypeB',
} as const;

type TestRecordDataType = typeof TEST_RECORD_DATA_TYPE[keyof typeof TEST_RECORD_DATA_TYPE];

interface TestRecordType extends RecordTypeBase {
  DataType: TestRecordDataType;
  StringColumn: string;
  NumberColumn: number;
  OptionalStringColumn?: string;
  OptionalNumberColumn?: number;
}

const generateTypeARecord = (): TestRecordType => {
  return {
    ID: CommonUtil.generateUUID(),
    DataType: TEST_RECORD_DATA_TYPE.TYPEA,
    StringColumn: 'stringA',
    NumberColumn: 123,
    Create: Date.now(),
    Update: Date.now(),
  };
}

const generateTypeBRecord = (): TestRecordType => {
  return {
    ID: CommonUtil.generateUUID(),
    DataType: TEST_RECORD_DATA_TYPE.TYPEB,
    StringColumn: 'stringB',
    NumberColumn: 456,
    OptionalStringColumn: 'optionalB',
    OptionalNumberColumn: 789,
    Create: Date.now(),
    Update: Date.now(),
  };
};

describe.skip('AWS Tests', () => {
  describe('DynamoDBService', () => {
    const tableName = 'Test';
    let dynamoDBService: DynamoDBService;

    beforeEach(() => {
      dynamoDBService = new DynamoDBService(tableName);
    });

    it('Get All', async () => {
      const item1 = generateTypeARecord();
      const item2 = generateTypeBRecord();

      await dynamoDBService.create(item1);
      await dynamoDBService.create(item2);

      const allItems = await dynamoDBService.getAll<TestRecordType>();

      expect(allItems.length).toBeGreaterThanOrEqual(2);
      expect(allItems.find(i => i.ID === item1.ID)).toBeDefined();
      expect(allItems.find(i => i.ID === item2.ID)).toBeDefined();
    });

    it('Get All By DataType', async () => {
      const item1 = generateTypeARecord();
      const item2 = generateTypeBRecord();

      await dynamoDBService.create(item1);
      await dynamoDBService.create(item2);

      const typeAItems = await dynamoDBService.getAllByDataType<TestRecordType>(TEST_RECORD_DATA_TYPE.TYPEA);
      const typeBItems = await dynamoDBService.getAllByDataType<TestRecordType>(TEST_RECORD_DATA_TYPE.TYPEB);

      expect(typeAItems.length).toBeGreaterThanOrEqual(1);
      expect(typeAItems.find(i => i.ID === item1.ID)).toBeDefined();
      expect(typeAItems.find(i => i.ID === item2.ID)).toBeUndefined();

      expect(typeBItems.length).toBeGreaterThanOrEqual(1);
      expect(typeBItems.find(i => i.ID === item2.ID)).toBeDefined();
      expect(typeBItems.find(i => i.ID === item1.ID)).toBeUndefined();
    });

    it('CRUD', async () => {
      const createItem: TestRecordType = generateTypeARecord();
      const id = createItem.ID;

      await dynamoDBService.create(createItem);

      const createResult = await dynamoDBService.getById<TestRecordType>(id);

      if (!createResult) {
        ErrorUtil.throwError('Item not found after creation');
      }

      expect(createResult.ID).toBe(createItem.ID);
      expect(createResult.DataType).toBe(createItem.DataType);
      expect(createResult.StringColumn).toBe(createItem.StringColumn);
      expect(createResult.NumberColumn).toBe(createItem.NumberColumn);
      expect(createResult.OptionalStringColumn).toBeUndefined();
      expect(createResult.OptionalNumberColumn).toBeUndefined();

      const updateItem: Partial<TestRecordType> = {
        StringColumn: 'updated',
        NumberColumn: 2,
        OptionalStringColumn: 'optional',
        OptionalNumberColumn: 42,
      };

      await dynamoDBService.update<TestRecordType>(id, TEST_RECORD_DATA_TYPE.TYPEA, updateItem);

      const updateResult = await dynamoDBService.getById<TestRecordType>(id);

      if (!updateResult) {
        ErrorUtil.throwError('Item not found after update');
      }

      expect(updateResult.ID).toBe(createItem.ID);
      expect(updateResult.DataType).toBe(createItem.DataType);
      expect(updateResult.StringColumn).toBe(updateItem.StringColumn);
      expect(updateResult.NumberColumn).toBe(updateItem.NumberColumn);
      expect(updateResult.OptionalStringColumn).toBe(updateItem.OptionalStringColumn);
      expect(updateResult.OptionalNumberColumn).toBe(updateItem.OptionalNumberColumn);

      await dynamoDBService.delete(id, TEST_RECORD_DATA_TYPE.TYPEA);

      const deleteResult = await dynamoDBService.getById<TestRecordType>(id);

      expect(deleteResult).toBeNull();
    });

    it('Delete Optional Columns', async () => {
      const createItem: TestRecordType = generateTypeBRecord();
      const id = createItem.ID;

      await dynamoDBService.create(createItem);

      const updateItem: Partial<TestRecordType> = {
        StringColumn: 'updated',
        NumberColumn: 2,
        OptionalStringColumn: null,
        OptionalNumberColumn: null,
      };

      await dynamoDBService.update<TestRecordType>(id, TEST_RECORD_DATA_TYPE.TYPEB, updateItem);

      const updateResult = await dynamoDBService.getById<TestRecordType>(id);

      if (!updateResult) {
        ErrorUtil.throwError('Item not found after update');
      }

      expect(updateResult.ID).toBe(createItem.ID);
      expect(updateResult.DataType).toBe(createItem.DataType);
      expect(updateResult.StringColumn).toBe(updateItem.StringColumn);
      expect(updateResult.NumberColumn).toBe(updateItem.NumberColumn);
      expect(updateResult.OptionalStringColumn).toBeUndefined();
      expect(updateResult.OptionalNumberColumn).toBeUndefined();
    });
  });
});
