import CRUDServiceBase from '@common/services/CRUDServiceBase';
import DateUtil from '@common/utils/DateUtil';
import ErrorUtil from '@common/utils/ErrorUtil';
import NotificationUtil from '@common/utils/NotificationUtil';
import TimeUtil from '@common/utils/TimeUtil';
import { SubscriptionType } from '@common/interfaces/SubscriptionType';
import { TimeType } from '@common/interfaces/TimeType';

import ExchangeService from '@finance/services/ExchangeService';
import FinanceNotificationDataAccessor from '@finance/services/FinanceNotificationDataAccessor';
import FinanceUtil from '@finance/utils/FinanceUtil';
import TickerService from '@finance/services/TickerService';
import { FinanceNotificationConditionType, FINANCE_NOTIFICATION_CONDITION_TYPE, DAILY_CONDITION_TYPES, MINUTE_LEVEL_CONDITION_TYPES, FINANCE_NOTIFICATION_FREQUENCY, FinanceNotificationConditionWithFrequency } from '@finance/types/FinanceNotificationType';
import { FinanceNotificationDataType } from '@finance/interfaces/data/FinanceNotificationDataType';
import { FinanceNotificationRecordType } from '@finance/interfaces/record/FinanceNotificationRecordType';
import { FINANCE_RECORD_DATA_TYPE } from '@finance/types/FinanceRecordDataType';
import { ExchangeDataType } from '@finance/interfaces/data/ExchangeDataType';
import { ConditionCheckerProvider, Condition, ConditionCheckParams } from '@finance/services/conditionChecker';

export default class FinanceNotificationService extends CRUDServiceBase<FinanceNotificationDataType, FinanceNotificationRecordType> {
  private conditionCheckerProvider: ConditionCheckerProvider;

  public constructor() {
    super(new FinanceNotificationDataAccessor(), FinanceNotificationService.dataToRecord, FinanceNotificationService.recordToData);
    
    // Initialize the condition checker provider with fallback to legacy methods
    this.conditionCheckerProvider = new ConditionCheckerProvider({
      fallbackHandler: this.legacyConditionCheck.bind(this)
    });
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

        // Parse conditions with frequency settings
        const conditionsWithFrequency = this.parseConditions(notification);

        // Check conditions in parallel for improved performance
        let conditionMet = false;
        let conditionMessage = '';

        // Filter conditions that should be checked based on timing
        const conditionsToCheck = conditionsWithFrequency.filter(conditionWithFreq => {
          if (!this.shouldCheckCondition(conditionWithFreq, exchange, notification)) {
            console.log(`Condition ${conditionWithFreq.type} skipped due to frequency constraint: ${conditionWithFreq.frequency}`);
            return false;
          }
          return true;
        });

        // If there are conditions to check, run them in parallel
        if (conditionsToCheck.length > 0) {
          // Start all condition checks in parallel
          const conditionPromises = conditionsToCheck.map(async (conditionWithFreq) => {
            try {
              const condition = await this.checkCondition(
                conditionWithFreq.type, 
                `${exchangeKey}:${tickerKey}`, 
                exchangeKey, 
                tickerKey, 
                notification.conditionValue, 
                notification.session
              );
              return { condition, conditionWithFreq, success: true };
            } catch (error) {
              // Log error but don't fail the entire check
              console.error(`Error checking condition ${conditionWithFreq.type}:`, error);
              return { condition: { met: false, message: '' }, conditionWithFreq, success: false };
            }
          });

          // Wait for all conditions to complete and find the first met condition
          const results = await Promise.allSettled(conditionPromises);
          
          for (const result of results) {
            if (result.status === 'fulfilled') {
              const { condition, conditionWithFreq } = result.value;
              if (condition.met) {
                conditionMet = true;
                conditionMessage = condition.message;
                console.log(`Condition ${conditionWithFreq.type} met with frequency ${conditionWithFreq.frequency}`);
                break; // Take the first met condition
              }
            }
          }
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

        // Update first notification flag if this is the first notification for pattern conditions
        if (!notification.firstNotificationSent) {
          const conditionsWithFreq = this.parseConditions(notification);
          const hasDailyCondition = conditionsWithFreq.some(c => this.isDailyCondition(c.type));
          
          if (hasDailyCondition) {
            console.log(`Marking first notification as sent for ${notification.id}`);
            await this.update({
              ...notification,
              firstNotificationSent: true
            });
          }
        }
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
      Session: data.session,
      Frequency: data.frequency,
      FirstNotificationSent: data.firstNotificationSent,
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
      session: record.Session,
      frequency: record.Frequency,
      firstNotificationSent: record.FirstNotificationSent,
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
  private isWithinExchangeHours(exchange: ExchangeDataType, currentTime: Date = DateUtil.getNowJSTAsDate()): boolean {
    const currentJSTTime = TimeUtil.getJSTTime(currentTime);
    const currentTotalMinutes = currentJSTTime.hour * 60 + currentJSTTime.minute;
    
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
  private isExchangeStartTime(exchange: ExchangeDataType, currentTime: Date = DateUtil.getNowJSTAsDate()): boolean {
    const currentJSTTime = TimeUtil.getJSTTime(currentTime);
    
    return currentJSTTime.hour === exchange.start.hour && currentJSTTime.minute === exchange.start.minute;
  }

  /**
   * Determine if condition type is daily-based or minute-level
   */
  private isDailyCondition(conditionType: FinanceNotificationConditionType): boolean {
    return DAILY_CONDITION_TYPES.includes(conditionType as any);
  }

  /**
   * Parse conditions from notification data, handling both legacy and new formats
   */
  private parseConditions(notification: FinanceNotificationDataType): FinanceNotificationConditionWithFrequency[] {
    if (notification.mode && notification.conditions) {
      try {
        const conditions = JSON.parse(notification.conditions);
        
        // Check if it's the new format (array of objects with type and frequency)
        if (Array.isArray(conditions) && conditions.length > 0 && typeof conditions[0] === 'object' && conditions[0].type) {
          return conditions as FinanceNotificationConditionWithFrequency[];
        }
        
        // Legacy format (array of strings) - convert to new format
        if (Array.isArray(conditions)) {
          const globalFrequency = notification.frequency || FINANCE_NOTIFICATION_FREQUENCY.MINUTE_LEVEL;
          return conditions.map((conditionType: string) => ({
            type: conditionType as FinanceNotificationConditionType,
            frequency: globalFrequency
          }));
        }
      } catch (error) {
        console.error('Error parsing conditions JSON:', error);
      }
    }
    
    // Fallback to legacy single condition format
    const globalFrequency = notification.frequency || FINANCE_NOTIFICATION_FREQUENCY.MINUTE_LEVEL;
    return [{
      type: notification.conditionType,
      frequency: globalFrequency
    }];
  }

  /**
   * Check if a specific condition should be checked based on its frequency setting
   */
  private shouldCheckCondition(
    conditionWithFrequency: FinanceNotificationConditionWithFrequency,
    exchange: ExchangeDataType,
    notification: FinanceNotificationDataType
  ): boolean {
    const currentTime = DateUtil.getNowJSTAsDate();
    
    // First check if we're within exchange hours
    if (!this.isWithinExchangeHours(exchange, currentTime)) {
      return false;
    }

    const { type: conditionType, frequency } = conditionWithFrequency;
    const hasDailyCondition = this.isDailyCondition(conditionType);
    
    switch (frequency) {
      case FINANCE_NOTIFICATION_FREQUENCY.EXCHANGE_START_ONLY:
        // Only send at exchange start
        return this.isExchangeStartTime(exchange, currentTime);
        
      case FINANCE_NOTIFICATION_FREQUENCY.MINUTE_LEVEL:
        // Every minute for price conditions, special logic for pattern conditions
        if (hasDailyCondition) {
          // Pattern conditions: first time OR exchange start time
          if (!notification.firstNotificationSent) {
            // First notification - allow during exchange hours
            return true;
          } else {
            // Subsequent notifications only at exchange start
            return this.isExchangeStartTime(exchange, currentTime);
          }
        }
        // Price conditions: always allow during exchange hours
        return true;
        
      case FINANCE_NOTIFICATION_FREQUENCY.TEN_MINUTE_LEVEL:
        // Every 10 minutes (only at first batch processing of each 10-minute window)
        return this.isTenMinuteInterval(currentTime);
        
      case FINANCE_NOTIFICATION_FREQUENCY.HOURLY_LEVEL:
        // Every hour (only when minute is 0)
        return this.isHourlyInterval(currentTime);
        
      default:
        console.log(`Unknown frequency: ${frequency}`);
        return false;
    }
  }

  /**
   * Check if notification should be sent based on timing rules
   */
  private shouldSendNotification(
    notification: FinanceNotificationDataType, 
    exchange: ExchangeDataType, 
    conditionTypes: FinanceNotificationConditionType[]
  ): boolean {
    const currentTime = DateUtil.getNowJSTAsDate();
    
    // First check if we're within exchange hours
    if (!this.isWithinExchangeHours(exchange, currentTime)) {
      console.log(`Notification ${notification.id} skipped - outside exchange hours`);
      return false;
    }

    // Check frequency preference
    const frequency = notification.frequency || FINANCE_NOTIFICATION_FREQUENCY.MINUTE_LEVEL;
    const hasDailyCondition = conditionTypes.some(type => this.isDailyCondition(type));
    
    switch (frequency) {
      case FINANCE_NOTIFICATION_FREQUENCY.EXCHANGE_START_ONLY:
        // Only send at exchange start
        if (!this.isExchangeStartTime(exchange, currentTime)) {
          console.log(`Notification ${notification.id} skipped - not exchange start time`);
          return false;
        }
        break;
        
      case FINANCE_NOTIFICATION_FREQUENCY.MINUTE_LEVEL:
        // Every minute for price conditions, special logic for pattern conditions
        if (hasDailyCondition) {
          // Pattern conditions: first time OR exchange start time
          if (!notification.firstNotificationSent) {
            // First notification - allow during exchange hours
            console.log(`Notification ${notification.id} - first notification for pattern condition`);
            break;
          } else if (!this.isExchangeStartTime(exchange, currentTime)) {
            // Subsequent notifications only at exchange start
            console.log(`Notification ${notification.id} skipped - pattern condition outside start time`);
            return false;
          }
        }
        // Price conditions: always allow during exchange hours (no additional restrictions)
        break;
        
      case FINANCE_NOTIFICATION_FREQUENCY.TEN_MINUTE_LEVEL:
        // Every 10 minutes (only at first batch processing of each 10-minute window)
        if (!this.isTenMinuteInterval(currentTime)) {
          console.log(`Notification ${notification.id} skipped - not at 10-minute interval`);
          return false;
        }
        break;
        
      case FINANCE_NOTIFICATION_FREQUENCY.HOURLY_LEVEL:
        // Every hour (only when minute is 0)
        if (!this.isHourlyInterval(currentTime)) {
          console.log(`Notification ${notification.id} skipped - not at hourly interval`);
          return false;
        }
        break;
        
      default:
        console.log(`Notification ${notification.id} - unknown frequency: ${frequency}`);
        return false;
    }
    
    return true;
  }

  /**
   * Check if current time is at a 10-minute interval (0, 10, 20, 30, 40, 50 minutes)
   */
  private isTenMinuteInterval(currentTime: Date): boolean {
    const minutes = currentTime.getMinutes();
    return minutes % 10 === 0;
  }

  /**
   * Check if current time is at an hourly interval (minute is 0)
   */
  private isHourlyInterval(currentTime: Date): boolean {
    const minutes = currentTime.getMinutes();
    return minutes === 0;
  }

  private async checkCondition(conditionType: FinanceNotificationConditionType, target: string, exchangeKey: string, tickerKey: string, conditionValue: number, session?: string): Promise<Condition> {
    const params: ConditionCheckParams = {
      target,
      exchangeKey,
      tickerKey,
      conditionValue,
      session
    };

    return await this.conditionCheckerProvider.checkCondition(conditionType, params);
  }

  /**
   * Legacy condition checking method used as fallback for patterns not yet migrated to new checker system
   * Since all condition types are now implemented in dedicated ConditionChecker classes, this method
   * should not be called for any known condition types.
   */
  private async legacyConditionCheck(conditionType: FinanceNotificationConditionType, params: ConditionCheckParams): Promise<Condition> {
    // All condition types are now implemented in dedicated ConditionChecker classes
    // This fallback should not be reached for any known condition types
    ErrorUtil.throwError(`Unknown condition type: ${conditionType}`);
    return { met: false, message: '' };
  }

}
