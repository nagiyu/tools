import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import fetch from 'node-fetch';

import TimeUtil from '@common/utils/TimeUtil';
import SecretsManagerUtil from '@common/aws/SecretsManagerUtil';

interface NotificationRequest {
  message: string;
  subscription: any;
}

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    // Parse the request body if it exists
    let requestBody: NotificationRequest | null = null;
    if (event.body) {
      try {
        requestBody = JSON.parse(event.body);
      } catch (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Invalid JSON in request body'
          })
        };
      }
    }

    // If notification request is provided, send the notification
    if (requestBody && requestBody.message && requestBody.subscription) {
      const { message, subscription } = requestBody;
      
      // Get client base URL from AWS Secrets Manager
      const baseUrl = await SecretsManagerUtil.getSecretValue(process.env.PROJECT_SECRET!, 'CLIENT_BASE_URL');
      const notificationEndpoint = `${baseUrl}/api/send-notification`;

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

        if (!response.ok) {
          const errorText = await response.text();
          return {
            statusCode: 500,
            body: JSON.stringify({
              error: `Failed to send notification: ${response.status} ${response.statusText}`,
              details: errorText
            })
          };
        }

        // Handle empty response bodies gracefully
        let result = null;
        const responseText = await response.text();
        if (responseText.trim()) {
          try {
            result = JSON.parse(responseText);
          } catch (parseError) {
            // If response is not valid JSON, treat it as text
            result = { response: responseText };
          }
        }

        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Notification sent successfully',
            result,
            time: TimeUtil.formatTime({ hour: 12, minute: 30 })
          })
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Failed to send notification request',
            details: error instanceof Error ? error.message : 'Unknown error'
          })
        };
      }
    }

    // Default response for basic health check
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Finance server is running',
        time: TimeUtil.formatTime({ hour: 12, minute: 30 }),
        endpoints: {
          notification: 'POST with { message, subscription } to send push notifications'
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
