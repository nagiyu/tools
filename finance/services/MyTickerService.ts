import CRUDServiceBase from '@common/services/CRUDServiceBase';

import MyTickerDataAccessor from '@finance/services/MyTickerDataAccessor';
import { MyTickerDataType } from '@finance/interfaces/data/MyTickerDataType';
import { MyTickerRecordType } from '@finance/interfaces/record/MyTickerRecordType';

export default class MyTickerService extends CRUDServiceBase<MyTickerDataType, MyTickerRecordType> {
  public constructor() {
    super(new MyTickerDataAccessor(), MyTickerService.dataToRecord, MyTickerService.recordToData);
  }

  private static dataToRecord(data: MyTickerDataType): MyTickerRecordType {
    return {
      ID: data.id,
      DataType: 'MyTicker',
      UserID: data.userId,
      ExchangeID: data.exchangeId,
      TickerID: data.tickerId,
      PurchaseDate: data.purchaseDate,
      PurchasePrice: data.purchasePrice,
      Quantity: data.quantity,
      SellDate: data.sellDate,
      SellPrice: data.sellPrice,
      Create: data.create,
      Update: data.update,
    };
  }

  private static recordToData(record: MyTickerRecordType): MyTickerDataType {
    return {
      id: record.ID,
      userId: record.UserID,
      exchangeId: record.ExchangeID,
      tickerId: record.TickerID,
      purchaseDate: record.PurchaseDate,
      purchasePrice: record.PurchasePrice,
      quantity: record.Quantity,
      sellDate: record.SellDate,
      sellPrice: record.SellPrice,
      create: record.Create,
      update: record.Update,
    };
  }
}
