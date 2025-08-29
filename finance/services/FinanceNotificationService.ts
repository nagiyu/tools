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

        console.log(`Checking stock price for ${exchangeKey}:${tickerKey}`);

        // Get current stock price using the actual keys
        const currentPrice = await FinanceUtil.getCurrentStockPrice(exchangeKey, tickerKey);

        if (currentPrice === null) {
          errors.push(`No stock data available for ${exchangeKey}:${tickerKey}`);
          continue;
        }

        console.log(`Current price for ${exchangeKey}:${tickerKey}: ${currentPrice}, condition: ${notification.conditionType} ${notification.conditionValue}`);

        // Check if condition is met
        const condition = this.checkCondition(notification.conditionType, `${exchangeKey}:${tickerKey}`, currentPrice, notification.conditionValue);

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

  private checkCondition(conditionType: FinanceNotificationConditionType, target: string, currentPrice: number, conditionValue: number): Condition {
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

      default:
        ErrorUtil.throwError(`Unknown condition type: ${conditionType}`);
    }

    return { met: false, message: '' };
  }

  private checkGreaterThan(currentPrice: number, conditionValue: number): boolean {
    return currentPrice > conditionValue;
  }

  private checkLessThan(currentPrice: number, conditionValue: number): boolean {
    return currentPrice < conditionValue;
  }
}
