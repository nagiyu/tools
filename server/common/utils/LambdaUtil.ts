import { Context, EventBridgeEvent } from 'aws-lambda';

import ErrorUtil from '@common/utils/ErrorUtil';

export default class LambdaUtil {
  public static async generateHandler<T>(
    func: (event: EventBridgeEvent<'Scheduled Event', T>, context: Context) => Promise<void>
  ): Promise<(event: EventBridgeEvent<'Scheduled Event', T>, context: Context) => Promise<void>> {
    return async (
      event: EventBridgeEvent<'Scheduled Event', T>,
      context: Context
    ): Promise<void> => {
      console.log('EventBridge event received', { event, context });

      try {
        await func(event, context);
        console.log('EventBridge event processed successfully');
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error processing EventBridge event:', error.message);
          ErrorUtil.throwError(`Error processing EventBridge event: ${error.message}`);
        } else {
          console.error('Unknown error processing EventBridge event');
          ErrorUtil.throwError('Unknown error processing EventBridge event');
        }
      }
    };
  }
}
