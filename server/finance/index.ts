import { Context, EventBridgeEvent } from 'aws-lambda';
import fetch from 'node-fetch';

import TimeUtil from '@common/utils/TimeUtil';
import SecretsManagerUtil from '@common/aws/SecretsManagerUtil';
import FinanceNotificationService from '@finance/services/FinanceNotificationService';
import FinanceUtil from '@finance/utils/FinanceUtil';
import { FinanceNotificationDataType } from '@finance/interfaces/data/FinanceNotificationDataType';
import { FINANCE_NOTIFICATION_CONDITION_TYPE } from '@finance/types/FinanceNotificationType';

interface EventBridgeDetail {
  scheduled?: boolean;
}

export const handler = async (
  event: EventBridgeEvent<'Scheduled Event', EventBridgeDetail>, 
  context: Context
): Promise<void> => {
  console.log('Finance notification service started', { event, context });

  try {
    const financeNotificationService = new FinanceNotificationService();
    
    // Get client base URL from AWS Secrets Manager
    const baseUrl = await SecretsManagerUtil.getSecretValue(process.env.PROJECT_SECRET!, 'CLIENT_BASE_URL');
    const notificationEndpoint = `${baseUrl}/api/send-notification`;

    // Run for 10 minutes (600 seconds), checking every minute (60 seconds)
    const endTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    const checkInterval = 60 * 1000; // 1 minute

    while (Date.now() < endTime) {
      try {
        console.log('Starting stock price check cycle');

        // Get all finance notifications
        const notifications = await financeNotificationService.get();
        console.log(`Found ${notifications.length} notification settings`);

        // Process each notification
        for (const notification of notifications) {
          try {
            await processNotification(notification, notificationEndpoint);
          } catch (error) {
            console.error('Error processing notification:', {
              notificationId: notification.id,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }

        console.log('Stock price check cycle completed');

        // Wait for next cycle (unless we're near the end time)
        const remainingTime = endTime - Date.now();
        if (remainingTime > checkInterval) {
          await new Promise(resolve => setTimeout(resolve, checkInterval));
        } else {
          break;
        }
      } catch (error) {
        console.error('Error in check cycle:', error instanceof Error ? error.message : 'Unknown error');
        // Continue with next cycle even if this one failed
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }
    }

    console.log('Finance notification service completed');
  } catch (error) {
    console.error('Fatal error in finance notification service:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

async function processNotification(
  notification: FinanceNotificationDataType,
  notificationEndpoint: string
): Promise<void> {
  try {
    // We need to get the exchange key for the stock price API
    // For now, we'll assume the exchangeId is the exchange key
    // This might need to be enhanced to lookup exchange data
    const exchangeKey = notification.exchangeId;
    const tickerKey = notification.tickerId;

    console.log(`Checking stock price for ${exchangeKey}:${tickerKey}`);

    // Get current stock price using the new helper method
    const currentPrice = await FinanceUtil.getCurrentStockPrice(exchangeKey, tickerKey);
    
    if (currentPrice === null) {
      console.log(`No stock data available for ${exchangeKey}:${tickerKey}`);
      return;
    }

    console.log(`Current price for ${exchangeKey}:${tickerKey}: ${currentPrice}, condition: ${notification.conditionType} ${notification.conditionValue}`);

    // Check if condition is met
    let conditionMet = false;
    let message = '';

    if (notification.conditionType === FINANCE_NOTIFICATION_CONDITION_TYPE.GREATER_THAN) {
      if (currentPrice > notification.conditionValue) {
        conditionMet = true;
        message = `${exchangeKey}:${tickerKey} price ${currentPrice} is above your target of ${notification.conditionValue}`;
      }
    } else if (notification.conditionType === FINANCE_NOTIFICATION_CONDITION_TYPE.LESS_THAN) {
      if (currentPrice < notification.conditionValue) {
        conditionMet = true;
        message = `${exchangeKey}:${tickerKey} price ${currentPrice} is below your target of ${notification.conditionValue}`;
      }
    }

    if (conditionMet) {
      console.log(`Condition met for notification ${notification.id}, sending push notification`);

      // Prepare subscription object
      const subscription = {
        endpoint: notification.subscriptionEndpoint,
        keys: {
          p256dh: notification.subscriptionKeysP256dh,
          auth: notification.subscriptionKeysAuth
        }
      };

      // Send push notification
      try {
        const response = await fetch(notificationEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            subscription,
          }),
        });

        if (response.ok) {
          console.log(`Push notification sent successfully for ${exchangeKey}:${tickerKey}`);
        } else {
          const errorText = await response.text();
          console.error(`Failed to send push notification: ${response.status} ${response.statusText}`, errorText);
        }
      } catch (fetchError) {
        console.error('Error sending push notification:', fetchError instanceof Error ? fetchError.message : 'Unknown error');
      }
    } else {
      console.log(`Condition not met for ${exchangeKey}:${tickerKey}`);
    }
  } catch (error) {
    console.error('Error processing notification:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}
