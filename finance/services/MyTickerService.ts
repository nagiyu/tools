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
      PurchaseDate: new Date(data.purchaseDate).getTime(),
      PurchasePrice: data.purchasePrice,
      Quantity: data.quantity,
      SellDate: data.sellDate ? new Date(data.sellDate).getTime() : null,
      SellPrice: data.sellPrice,
      Create: new Date(data.create).getTime(),
      Update: new Date(data.update).getTime(),
    };
  }

  private static recordToData(record: MyTickerRecordType): MyTickerDataType {
    return {
      id: record.ID,
      userId: record.UserID,
      exchangeId: record.ExchangeID,
      tickerId: record.TickerID,
      purchaseDate: new Date(record.PurchaseDate),
      purchasePrice: record.PurchasePrice,
      quantity: record.Quantity,
      sellDate: record.SellDate ? new Date(record.SellDate) : null,
      sellPrice: record.SellPrice,
      create: new Date(record.Create),
      update: new Date(record.Update),
    };
  }
}
