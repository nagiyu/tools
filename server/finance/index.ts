import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

import TimeUtil from '@common/utils/TimeUtil';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda!',
      time: TimeUtil.formatTime({ hour: 12, minute: 30 })
    })
  };
  return response;
};
