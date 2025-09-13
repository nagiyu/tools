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

const generateTypeARecord = (): Partial<TestRecordType> => {
  return {
    DataType: TEST_RECORD_DATA_TYPE.TYPEA,
    StringColumn: 'stringA',
    NumberColumn: 123,
  };
}

const generateTypeBRecord = (): Partial<TestRecordType> => {
  return {
    DataType: TEST_RECORD_DATA_TYPE.TYPEB,
    StringColumn: 'stringB',
    NumberColumn: 456,
    OptionalStringColumn: 'optionalB',
    OptionalNumberColumn: 789,
  };
};

describe.skip('AWS Tests', () => {
  describe('DynamoDBService', () => {
    const tableName = 'Test';
    let dynamoDBService: DynamoDBService<TestRecordType>;

    beforeEach(() => {
      dynamoDBService = new DynamoDBService(tableName);
    });

    it('Get All', async () => {
      const item1 = await dynamoDBService.create(generateTypeARecord());
      const item2 = await dynamoDBService.create(generateTypeBRecord());

      const allItems = await dynamoDBService.getAll();

      expect(allItems.length).toBeGreaterThanOrEqual(2);
      expect(allItems.find(i => i.ID === item1.ID)).toBeDefined();
      expect(allItems.find(i => i.ID === item2.ID)).toBeDefined();
    });

    it('Get All By DataType', async () => {
      const item1 = await dynamoDBService.create(generateTypeARecord());
      const item2 = await dynamoDBService.create(generateTypeBRecord());

      const typeAItems = await dynamoDBService.getAllByDataType(TEST_RECORD_DATA_TYPE.TYPEA);
      const typeBItems = await dynamoDBService.getAllByDataType(TEST_RECORD_DATA_TYPE.TYPEB);

      expect(typeAItems.length).toBeGreaterThanOrEqual(1);
      expect(typeAItems.find(i => i.ID === item1.ID)).toBeDefined();
      expect(typeAItems.find(i => i.ID === item2.ID)).toBeUndefined();

      expect(typeBItems.length).toBeGreaterThanOrEqual(1);
      expect(typeBItems.find(i => i.ID === item2.ID)).toBeDefined();
      expect(typeBItems.find(i => i.ID === item1.ID)).toBeUndefined();
    });

    it('CRUD', async () => {
      const createItem = await dynamoDBService.create(generateTypeARecord());
      const id = createItem.ID;

      const createResult = await dynamoDBService.getById(id);

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

      const updateResult = await dynamoDBService.update(id, TEST_RECORD_DATA_TYPE.TYPEA, updateItem);

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

      const deleteResult = await dynamoDBService.getById(id);

      expect(deleteResult).toBeNull();
    });

    it('Delete Optional Columns', async () => {
      const createItem = await dynamoDBService.create(generateTypeBRecord());
      const id = createItem.ID;

      const updateItem: Partial<TestRecordType> = {
        StringColumn: 'updated',
        NumberColumn: 2,
        OptionalStringColumn: null,
        OptionalNumberColumn: null,
      };

      const updateResult = await dynamoDBService.update(id, TEST_RECORD_DATA_TYPE.TYPEB, updateItem);

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
