import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import SecretsManagerUtil from '@common/aws/SecretsManagerUtil';

export default class DynamoDBUtil {
  /**
   * Creates a DynamoDBClient based on the environment.
   * If the environment is 'local', it uses credentials from AWS Secrets Manager.
   * Otherwise, it uses the default credentials provider chain.
   * @returns {DynamoDBClient} The configured DynamoDBClient.
   */
  private async getDynamoClient(): Promise<DynamoDBClient> {
    const secretName = process.env.PROJECT_SECRET!;

    if (process.env.PROCESS_ENV !== 'local') {
      return new DynamoDBClient({
        region: await SecretsManagerUtil.getSecretValue(secretName, 'AWS_REGION'),
      });
    }

    return new DynamoDBClient({
      region: await SecretsManagerUtil.getSecretValue(secretName, 'AWS_REGION'),
      credentials: {
        accessKeyId: await SecretsManagerUtil.getSecretValue(secretName, 'AWS_ACCESS_KEY'),
        secretAccessKey: await SecretsManagerUtil.getSecretValue(secretName, 'AWS_SECRET_ACCESS_KEY')
      }
    });
  }
}
