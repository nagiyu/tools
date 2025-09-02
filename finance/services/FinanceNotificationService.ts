import CRUDServiceBase from '@common/services/CRUDServiceBase';
import ErrorUtil from '@common/utils/ErrorUtil';
import NotificationUtil from '@common/utils/NotificationUtil';
import { SubscriptionType } from '@common/interfaces/SubscriptionType';

import ExchangeService from '@finance/services/ExchangeService';
import FinanceNotificationDataAccessor from '@finance/services/FinanceNotificationDataAccessor';
import FinanceUtil from '@finance/utils/FinanceUtil';
import TickerService from '@finance/services/TickerService';
import { FinanceNotificationConditionType, FINANCE_NOTIFICATION_CONDITION_TYPE } from '@finance/types/FinanceNotificationType';
import { FinanceNotificationDataType } from '@finance/interfaces/data/FinanceNotificationDataType';
import { FinanceNotificationRecordType } from '@finance/interfaces/record/FinanceNotificationRecordType';
import { FINANCE_RECORD_DATA_TYPE } from '@finance/types/FinanceRecordDataType';

interface Condition {
  met: boolean;
  message: string;
}

export default class FinanceNotificationService extends CRUDServiceBase<FinanceNotificationDataType, FinanceNotificationRecordType> {
  public constructor() {
    super(new FinanceNotificationDataAccessor(), FinanceNotificationService.dataToRecord, FinanceNotificationService.recordToData);
  }

  public async notification(endpoint: string): Promise<void> {
    const notifications = await this.get();

    const errors: string[] = [];

    for (const notification of notifications) {
      try {
        console.log(`Looking up exchange and ticker data for notification ${notification.id}`);

        const exchangeKey = await this.getExchangeKey(notification.exchangeId);
        const tickerKey = await this.getTickerKey(notification.tickerId);

        console.log(`Checking condition for ${exchangeKey}:${tickerKey}`);

        // Check if condition is met
        const condition = await this.checkCondition(notification.conditionType, `${exchangeKey}:${tickerKey}`, exchangeKey, tickerKey, notification.conditionValue);

        if (!condition.met) {
          continue;
        }

        console.log(`Condition met for notification ${notification.id}, sending push notification`);

        // Prepare subscription object
        const subscription: SubscriptionType = {
          endpoint: notification.subscriptionEndpoint,
          keys: {
            p256dh: notification.subscriptionKeysP256dh,
            auth: notification.subscriptionKeysAuth
          }
        };

        await NotificationUtil.sendPushNotification(endpoint, condition.message, subscription);
      } catch (error) {
        if (error instanceof Error) {
          errors.push(`Error processing notification ${notification.id}: ${error.message}`);
        } else {
          errors.push(`Unknown error processing notification ${notification.id}`);
        }
      }
    }

    if (errors.length > 0) {
      ErrorUtil.throwError(errors.join('; '));
    }
  }

  private static dataToRecord(data: FinanceNotificationDataType): FinanceNotificationRecordType {
    return {
      ID: data.id,
      DataType: FINANCE_RECORD_DATA_TYPE.FINANCE_NOTIFICATION,
      TerminalID: data.terminalId,
      SubscriptionEndpoint: data.subscriptionEndpoint,
      SubscriptionKeysP256dh: data.subscriptionKeysP256dh,
      SubscriptionKeysAuth: data.subscriptionKeysAuth,
      ExchangeID: data.exchangeId,
      TickerID: data.tickerId,
      ConditionType: data.conditionType,
      ConditionValue: data.conditionValue,
      TimeFrame: data.timeFrame,
      Create: data.create,
      Update: data.update,
    };
  }

  private static recordToData(record: FinanceNotificationRecordType): FinanceNotificationDataType {
    return {
      id: record.ID,
      terminalId: record.TerminalID,
      subscriptionEndpoint: record.SubscriptionEndpoint,
      subscriptionKeysP256dh: record.SubscriptionKeysP256dh,
      subscriptionKeysAuth: record.SubscriptionKeysAuth,
      exchangeId: record.ExchangeID,
      tickerId: record.TickerID,
      conditionType: record.ConditionType,
      conditionValue: record.ConditionValue,
      timeFrame: record.TimeFrame,
      create: record.Create,
      update: record.Update,
    };
  }

  private async getExchangeKey(exchangeId: string): Promise<string> {
    const service = new ExchangeService();
    const exchanges = await service.get();
    const exchange = exchanges.find(e => e.id === exchangeId);

    if (!exchange) {
      ErrorUtil.throwError(`Exchange not found for ID: ${exchangeId}`);
    }

    return exchange.key;
  }

  private async getTickerKey(tickerId: string): Promise<string> {
    const service = new TickerService();
    const tickers = await service.get();
    const ticker = tickers.find(t => t.id === tickerId);

    if (!ticker) {
      ErrorUtil.throwError(`Ticker not found for ID: ${tickerId}`);
    }

    return ticker.key;
  }

  private async checkCondition(conditionType: FinanceNotificationConditionType, target: string, exchangeKey: string, tickerKey: string, conditionValue: number): Promise<Condition> {
    switch (conditionType) {
      case FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN:
      case FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN:
        return await this.checkPriceCondition(conditionType, target, exchangeKey, tickerKey, conditionValue);

      case FINANCE_NOTIFICATION_CONDITION_TYPE.THREE_RED_SOLDIERS:
        return await this.checkThreeRedSoldiers(target, exchangeKey, tickerKey);

      case FINANCE_NOTIFICATION_CONDITION_TYPE.THREE_RIVER_EVENING_STAR:
        return await this.checkThreeRiverEveningStar(target, exchangeKey, tickerKey);

      default:
        ErrorUtil.throwError(`Unknown condition type: ${conditionType}`);
    }

    return { met: false, message: '' };
  }

  private async checkPriceCondition(conditionType: FinanceNotificationConditionType, target: string, exchangeKey: string, tickerKey: string, conditionValue: number): Promise<Condition> {
    const currentPrice = await FinanceUtil.getCurrentStockPrice(exchangeKey, tickerKey);

    if (currentPrice === null) {
      return { met: false, message: `No stock data available for ${target}` };
    }

    console.log(`Current price for ${target}: ${currentPrice}, condition: ${conditionType} ${conditionValue}`);

    switch (conditionType) {
      case FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN:
        if (this.checkGreaterThan(currentPrice, conditionValue)) {
          return { met: true, message: `${target} price ${currentPrice} is above your target of ${conditionValue}` };
        }
        break;

      case FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN:
        if (this.checkLessThan(currentPrice, conditionValue)) {
          return { met: true, message: `${target} price ${currentPrice} is below your target of ${conditionValue}` };
        }
        break;
    }

    return { met: false, message: '' };
  }

  private async checkThreeRedSoldiers(target: string, exchangeKey: string, tickerKey: string): Promise<Condition> {
    try {
      const stockData = await FinanceUtil.getStockPriceData(exchangeKey, tickerKey, { count: 3 });

      if (!stockData || !Array.isArray(stockData) || stockData.length < 3) {
        return { met: false, message: `Insufficient data for ${target}` };
      }

      // Get the last 3 candles (most recent data)
      const candles = stockData.slice(-3);
      
      // Check if all 3 candles are bullish (close > open)
      const allBullish = candles.every(candle => candle.data[1] > candle.data[0]); // close > open

      if (!allBullish) {
        return { met: false, message: '' };
      }

      // Check if 2nd and 3rd candles start within the range of the previous candle
      const firstCandle = candles[0];
      const secondCandle = candles[1];
      const thirdCandle = candles[2];

      const firstLow = firstCandle.data[2];
      const firstHigh = firstCandle.data[3];
      const secondOpen = secondCandle.data[0];
      const secondLow = secondCandle.data[2];
      const secondHigh = secondCandle.data[3];
      const thirdOpen = thirdCandle.data[0];

      // Second candle should start within first candle's range
      const secondStartsInRange = secondOpen >= firstLow && secondOpen <= firstHigh;
      
      // Third candle should start within second candle's range
      const thirdStartsInRange = thirdOpen >= secondLow && thirdOpen <= secondHigh;

      if (secondStartsInRange && thirdStartsInRange) {
        return { met: true, message: `${target} shows Three Red Soldiers pattern - strong bullish signal detected` };
      }

      return { met: false, message: '' };
    } catch (error) {
      console.error('Error checking Three Red Soldiers pattern:', error);
      return { met: false, message: `Error checking pattern for ${target}` };
    }
  }

  private async checkThreeRiverEveningStar(target: string, exchangeKey: string, tickerKey: string): Promise<Condition> {
    try {
      const stockData = await FinanceUtil.getStockPriceData(exchangeKey, tickerKey, { count: 3 });

      if (!stockData || !Array.isArray(stockData) || stockData.length < 3) {
        return { met: false, message: `Insufficient data for ${target}` };
      }

      // Get the last 3 candles (most recent data)
      const candles = stockData.slice(-3);
      
      const firstCandle = candles[0];
      const secondCandle = candles[1];
      const thirdCandle = candles[2];

      // First candle should be a long bearish candle
      const firstIsBearish = firstCandle.data[1] < firstCandle.data[0]; // close < open
      const firstCandleSize = Math.abs(firstCandle.data[1] - firstCandle.data[0]);
      const firstIsLong = firstCandleSize > (firstCandle.data[3] - firstCandle.data[2]) * 0.6; // body is more than 60% of the range

      // Second candle should be a small bullish candle with a gap up
      const secondIsBullish = secondCandle.data[1] > secondCandle.data[0]; // close > open
      const secondCandleSize = Math.abs(secondCandle.data[1] - secondCandle.data[0]);
      const secondIsSmall = secondCandleSize < firstCandleSize * 0.5; // less than half the size of first candle
      const hasGapUp = secondCandle.data[2] > firstCandle.data[3]; // second candle's low > first candle's high

      // Third candle should be bullish
      const thirdIsBullish = thirdCandle.data[1] > thirdCandle.data[0]; // close > open

      if (firstIsBearish && firstIsLong && secondIsBullish && secondIsSmall && hasGapUp && thirdIsBullish) {
        return { met: true, message: `${target} shows Three River Evening Star pattern - potential reversal signal detected` };
      }

      return { met: false, message: '' };
    } catch (error) {
      console.error('Error checking Three River Evening Star pattern:', error);
      return { met: false, message: `Error checking pattern for ${target}` };
    }
  }

  private checkGreaterThan(currentPrice: number, conditionValue: number): boolean {
    return currentPrice > conditionValue;
  }

  private checkLessThan(currentPrice: number, conditionValue: number): boolean {
    return currentPrice < conditionValue;
  }
}
