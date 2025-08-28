# Stock Price Notification Implementation

## Overview
This implementation enables the server finance Lambda function to automatically check stock prices and send push notifications to users when their specified conditions are met.

## How it works

### Event Trigger
The Lambda function is now triggered by CloudWatch Events (EventBridge) every 10 minutes instead of Web requests.

### Stock Price Monitoring Process
1. **Continuous Execution**: Runs for 10 minutes when triggered by EventBridge
2. **Regular Checks**: Checks stock prices every 1 minute during the execution period
3. **User Notifications**: Gets user notification settings from FinanceNotificationService
4. **Condition Evaluation**: Compares current stock prices against user-defined conditions
5. **Push Notifications**: Sends notifications when conditions are met

### Server Side (`server/finance/index.ts`)
The Lambda function now:
- Accepts EventBridge events instead of API Gateway events
- Runs continuously for 10 minutes
- Checks stock prices every minute using FinanceUtil.getCurrentStockPrice()
- Gets notification settings via FinanceNotificationService
- Sends push notifications via the client finance application

### Data Flow
1. **Get Notifications**: Fetch all user notification settings from DynamoDB
2. **Check Prices**: For each notification, get current stock price via TradingView API
3. **Evaluate Conditions**: Compare current price with user's target price and condition type
4. **Send Notifications**: If condition is met, send push notification to user's subscription

### Client Side (`client/finance/app/api/send-notification/route.ts`)
The existing endpoint receives the notification request and uses `NotificationUtil.sendNotification` to send the actual push notification.

## Supported Conditions
- **Greater Than**: Notify when stock price goes above target
- **Less Than**: Notify when stock price goes below target

## Environment Variables
- `PROJECT_SECRET`: AWS Secrets Manager secret containing CLIENT_BASE_URL
- `CLIENT_BASE_URL`: The base URL of the client application

## Architecture Changes
- **Input**: Changed from APIGatewayEvent to EventBridge event
- **Execution**: Continuous 10-minute execution with 1-minute intervals
- **Data Access**: Uses FinanceNotificationService for user notification settings
- **Stock Data**: Enhanced FinanceUtil with getCurrentStockPrice() method