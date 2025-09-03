import CRUDServiceBase from '@common/services/CRUDServiceBase';
import ErrorUtil from '@common/utils/ErrorUtil';
import NotificationUtil from '@common/utils/NotificationUtil';
import { SubscriptionType } from '@common/interfaces/SubscriptionType';
import { TimeType } from '@common/interfaces/TimeType';

import ExchangeService from '@finance/services/ExchangeService';
import FinanceNotificationDataAccessor from '@finance/services/FinanceNotificationDataAccessor';
import FinanceUtil from '@finance/utils/FinanceUtil';
import TickerService from '@finance/services/TickerService';
import { FinanceNotificationConditionType, FINANCE_NOTIFICATION_CONDITION_TYPE, DAILY_CONDITION_TYPES, MINUTE_LEVEL_CONDITION_TYPES, FINANCE_NOTIFICATION_FREQUENCY } from '@finance/types/FinanceNotificationType';
import { FinanceNotificationDataType } from '@finance/interfaces/data/FinanceNotificationDataType';
import { FinanceNotificationRecordType } from '@finance/interfaces/record/FinanceNotificationRecordType';
import { FINANCE_RECORD_DATA_TYPE } from '@finance/types/FinanceRecordDataType';
import { ExchangeDataType } from '@finance/interfaces/data/ExchangeDataType';

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

        const exchange = await this.getExchange(notification.exchangeId);
        const exchangeKey = exchange.key;
        const tickerKey = await this.getTickerKey(notification.tickerId);

        console.log(`Checking condition for ${exchangeKey}:${tickerKey}`);

        // Determine condition types for timing validation
        let conditionTypes: FinanceNotificationConditionType[] = [];
        
        if (notification.mode && notification.conditions) {
          try {
            conditionTypes = JSON.parse(notification.conditions) as FinanceNotificationConditionType[];
          } catch (error) {
            console.error('Error parsing conditions JSON:', error);
            conditionTypes = [notification.conditionType];
          }
        } else {
          conditionTypes = [notification.conditionType];
        }

        // Check timing constraints before checking conditions
        if (!this.shouldSendNotification(notification, exchange, conditionTypes)) {
          continue;
        }

        // Check if condition is met - handle both legacy and new formats
        let conditionMet = false;
        let conditionMessage = '';

        if (notification.mode && notification.conditions) {
          // New multi-condition format
          try {
            const conditions: string[] = JSON.parse(notification.conditions);
            for (const conditionType of conditions) {
              const condition = await this.checkCondition(conditionType as FinanceNotificationConditionType, `${exchangeKey}:${tickerKey}`, exchangeKey, tickerKey, notification.conditionValue);
              if (condition.met) {
                conditionMet = true;
                conditionMessage = condition.message;
                break; // If any condition is met, trigger notification
              }
            }
          } catch (error) {
            console.error('Error parsing conditions JSON:', error);
            // Fall back to legacy format
            const condition = await this.checkCondition(notification.conditionType, `${exchangeKey}:${tickerKey}`, exchangeKey, tickerKey, notification.conditionValue);
            conditionMet = condition.met;
            conditionMessage = condition.message;
          }
        } else {
          // Legacy single condition format
          const condition = await this.checkCondition(notification.conditionType, `${exchangeKey}:${tickerKey}`, exchangeKey, tickerKey, notification.conditionValue);
          conditionMet = condition.met;
          conditionMessage = condition.message;
        }

        if (!conditionMet) {
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

        await NotificationUtil.sendPushNotification(endpoint, conditionMessage, subscription);
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
      Mode: data.mode,
      Conditions: data.conditions,
      TimeFrame: data.timeFrame,
      Frequency: data.frequency,
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
      mode: record.Mode,
      conditions: record.Conditions,
      timeFrame: record.TimeFrame,
      frequency: record.Frequency,
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

  private async getExchange(exchangeId: string): Promise<ExchangeDataType> {
    const service = new ExchangeService();
    const exchanges = await service.get();
    const exchange = exchanges.find(e => e.id === exchangeId);

    if (!exchange) {
      ErrorUtil.throwError(`Exchange not found for ID: ${exchangeId}`);
    }

    return exchange;
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

  /**
   * Check if current time is within exchange operating hours
   */
  private isWithinExchangeHours(exchange: ExchangeDataType, currentTime: Date = new Date()): boolean {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    
    const startTotalMinutes = exchange.start.hour * 60 + exchange.start.minute;
    const endTotalMinutes = exchange.end.hour * 60 + exchange.end.minute;
    
    // Check if exchange operates across midnight (e.g., 23:00 to 01:00)
    if (startTotalMinutes > endTotalMinutes) {
      // Exchange crosses midnight - check both ranges
      return currentTotalMinutes >= startTotalMinutes || currentTotalMinutes <= endTotalMinutes;
    } else {
      // Normal case - start time is before end time
      return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
    }
  }

  /**
   * Check if current time is the start of exchange hours (for daily notifications)
   */
  private isExchangeStartTime(exchange: ExchangeDataType, currentTime: Date = new Date()): boolean {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    
    return currentHour === exchange.start.hour && currentMinute === exchange.start.minute;
  }

  /**
   * Determine if condition type is daily-based or minute-level
   */
  private isDailyCondition(conditionType: FinanceNotificationConditionType): boolean {
    return DAILY_CONDITION_TYPES.includes(conditionType as any);
  }

  /**
   * Check if notification should be sent based on timing rules
   */
  private shouldSendNotification(
    notification: FinanceNotificationDataType, 
    exchange: ExchangeDataType, 
    conditionTypes: FinanceNotificationConditionType[]
  ): boolean {
    const currentTime = new Date();
    
    // First check if we're within exchange hours
    if (!this.isWithinExchangeHours(exchange, currentTime)) {
      console.log(`Notification ${notification.id} skipped - outside exchange hours`);
      return false;
    }

    // Check frequency preference
    const frequency = notification.frequency || FINANCE_NOTIFICATION_FREQUENCY.MINUTE_LEVEL;
    
    if (frequency === FINANCE_NOTIFICATION_FREQUENCY.EXCHANGE_START_ONLY) {
      // Only send at exchange start
      if (!this.isExchangeStartTime(exchange, currentTime)) {
        console.log(`Notification ${notification.id} skipped - not exchange start time`);
        return false;
      }
    } else {
      // MINUTE_LEVEL frequency - check condition types
      const hasDailyCondition = conditionTypes.some(type => this.isDailyCondition(type));
      
      if (hasDailyCondition) {
        // For daily conditions, only notify at exchange start unless explicitly allowed
        if (!this.isExchangeStartTime(exchange, currentTime)) {
          console.log(`Notification ${notification.id} skipped - daily condition outside start time`);
          return false;
        }
      }
      // For minute-level conditions, always allow during exchange hours
    }
    
    return true;
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
