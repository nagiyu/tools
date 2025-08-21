# Push Notification Implementation

## Overview
This implementation enables the server finance Lambda function to send push notifications to the client finance application.

## How it works

### Server Side (`server/finance/index.ts`)
The Lambda function now accepts POST requests with the following payload:

```json
{
  "message": "Your notification message",
  "subscription": {
    "endpoint": "https://...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
}
```

### Client Side (`client/finance/app/api/send-notification/route.ts`)
The existing endpoint receives the notification request and uses `NotificationUtil.sendNotification` to send the actual push notification.

## Usage

1. **Health Check**: Send GET request to get server status
2. **Send Notification**: Send POST request with message and subscription data

## Environment Variables
- `CLIENT_BASE_URL`: The base URL of the client application (optional, defaults to localhost:3000)

## Testing
Use the `test.rest` file with your REST client to test the functionality.