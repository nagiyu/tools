import DynamoDBServiceMock from '@common/tests/mock/services/aws/DynamoDBServiceMock';

import FinanceNotificationDataAccessor from '@finance/services/FinanceNotificationDataAccessor';
import { FinanceNotificationRecordType } from '@finance/interfaces/record/FinanceNotificationRecordType';

export default class FinanceNotificationDataAccessorMock extends FinanceNotificationDataAccessor {
  private recordList: FinanceNotificationRecordType[] = [];

  public constructor() {
    super(new DynamoDBServiceMock(FinanceNotificationDataAccessorMock.getFinanceTableName()));
  }

  public override async get(): Promise<FinanceNotificationRecordType[]> {
    return this.recordList;
  }

  public override async update(id: string, updates: Partial<FinanceNotificationRecordType>): Promise<FinanceNotificationRecordType | null> {
    const index = this.recordList.findIndex(record => record.ID === id);
    if (index === -1) {
      return null;
    }

    this.recordList[index] = { ...this.recordList[index], ...updates };
    return this.recordList[index];
  }

  public createRecords(records: FinanceNotificationRecordType[]): void {
    this.recordList = records;
  }
}
