import DynamoDBUtil from '@common/aws/DynamoDBUtil';
import TimeUtil from '@common/utils/TimeUtil';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';

import { ExchangeDataType } from '@/interfaces/data/ExchangeDataType';
import { ExchangeRecordType } from '@/interfaces/records/ExchangeRecordType';

export default class ExchangeUtil {
    public static ConvertExchange(record: ExchangeRecordType): ExchangeDataType {
        return {
            id: record.ID,
            name: record.Name,
            key: record.Key,
            start: TimeUtil.parseTime(record.Start),
            end: TimeUtil.parseTime(record.End),
            create: record.Create,
            update: record.Update
        };
    }

    public static ConvertExchangeRecord(exchange: ExchangeDataType): ExchangeRecordType {
        return {
            ID: exchange.id,
            DataType: 'Exchange',
            Name: exchange.name,
            Key: exchange.key,
            Start: TimeUtil.formatTime(exchange.start),
            End: TimeUtil.formatTime(exchange.end),
            Create: exchange.create,
            Update: exchange.update
        };
    }

    public static async GetAll(): Promise<ExchangeDataType[]> {
        const exchangeRecords = await DynamoDBUtil.getAllByDataType<ExchangeRecordType>(this.GetExchangeTableName(), 'Exchange');
        return exchangeRecords.map(this.ConvertExchange);
    }

    public static async Create(exchange: ExchangeDataType): Promise<void> {
        const record = this.ConvertExchangeRecord(exchange);
        await DynamoDBUtil.create(this.GetExchangeTableName(), record);
    }

    public static async Update(exchange: ExchangeDataType): Promise<void> {
        const record = this.ConvertExchangeRecord(exchange);
        await DynamoDBUtil.update(this.GetExchangeTableName(), record.ID, 'Exchange', record);
    }

    public static async Delete(id: string): Promise<void> {
        await DynamoDBUtil.delete(this.GetExchangeTableName(), id, 'Exchange');
    }

    private static GetExchangeTableName(): string {
        switch (EnvironmentalUtil.GetProcessEnv()) {
            case 'local':
            case 'development':
                return 'DevFinance';
            case 'production':
                return 'Finance';
            default:
                return 'DevFinance';
        }
    }
}
