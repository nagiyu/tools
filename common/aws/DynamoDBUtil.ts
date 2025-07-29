import { DynamoDBClient, ScanCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import ErrorUtil from '@common/utils/ErrorUtil';
import SecretsManagerUtil from '@common/aws/SecretsManagerUtil';
import { RecordTypeBase } from '@common/aws/interfaces/DynamoDB/RecordTypeBase';

export default class DynamoDBUtil {
  /**
   * Creates a DynamoDBClient based on the environment.
   * If the environment is 'local', it uses credentials from AWS Secrets Manager.
   * Otherwise, it uses the default credentials provider chain.
   * @returns {DynamoDBClient} The configured DynamoDBClient.
   */
  private static async getDynamoClient(): Promise<DynamoDBClient> {
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

  /**
   * Retrieves all records from a DynamoDB table.
   * @template T The type of records to retrieve, extending RecordTypeBase.
   * @param tableName The name of the DynamoDB table to scan.
   * @throws Throws an error using ErrorUtil if the scan operation fails.
    * @returns {Promise<T[]>} A promise that resolves to an array of records of type T.
   */
  public static async getAll<T extends RecordTypeBase>(tableName: string): Promise<T[]> {
    const dynamoClient = await this.getDynamoClient();

    const command = new ScanCommand({
      TableName: tableName
    });

    try {
      const response = await dynamoClient.send(command);
      const items = response.Items || [];
      return items.map(item => unmarshall(item) as T);
    } catch (error) {
      throw ErrorUtil.throwError(error);
    }
  }

  /**
   * Retrieves all records from a DynamoDB table filtered by DataType.
   * @template T The type of records to retrieve, extending RecordTypeBase.
   * @param tableName The name of the DynamoDB table to scan.
   * @param dataTypeValue The DataType value to filter by.
   * @returns {Promise<T[]>} A promise that resolves to an array of records of type T.
   */
  public static async getAllByDataType<T extends RecordTypeBase>(
    tableName: string,
    dataTypeValue: string
  ): Promise<T[]> {
    const dynamoClient = await this.getDynamoClient();

    const command = new ScanCommand({
      TableName: tableName,
      FilterExpression: "#dt = :dt",
      ExpressionAttributeNames: { "#dt": "DataType" },
      ExpressionAttributeValues: { ":dt": { S: dataTypeValue } }
    });

    try {
      const response = await dynamoClient.send(command);
      const items = response.Items || [];
      return items.map(item => unmarshall(item) as T);
    } catch (error) {
      throw ErrorUtil.throwError(error);
    }
  }

  /**
   * Adds a new record to a DynamoDB table.
   * @template T The type of the record to add.
   * @param tableName The name of the DynamoDB table.
   * @param item The record to add.
   */
  public static async create<T extends RecordTypeBase>(
    tableName: string,
    item: T
  ): Promise<void> {
    const dynamoClient = await this.getDynamoClient();

    const command = new PutItemCommand({
      TableName: tableName,
      Item: marshall(item)
    });

    try {
      await dynamoClient.send(command);
    } catch (error) {
      throw ErrorUtil.throwError(error);
    }
  }

  /**
   * Updates an existing record in a DynamoDB table.
   * @template T The type of the record to update.
   * @param tableName The name of the DynamoDB table.
   * @param key The primary key of the record to update.
   * @param updates The attributes to update.
   */
  public static async update<T extends RecordTypeBase>(
    tableName: string,
    id: string,
    updates: Partial<T>
  ): Promise<void> {
    const dynamoClient = await this.getDynamoClient();

    const updateEntries = Object.entries(updates).filter(([_, v]) => v !== undefined && v !== null);
    const updateExpr = updateEntries.map(([k]) => `#${k} = :${k}`).join(', ');
    const exprAttrNames = Object.fromEntries(updateEntries.map(([k]) => [`#${k}`, k]));
    const exprAttrValues = Object.fromEntries(updateEntries.map(([k, v]) => [`:${k}`, marshall({ [k]: v })[k]]));

    const command = new UpdateItemCommand({
      TableName: tableName,
      Key: marshall({ ID: id }),
      UpdateExpression: `SET ${updateExpr}`,
      ExpressionAttributeNames: exprAttrNames,
      ExpressionAttributeValues: exprAttrValues
    });

    try {
      await dynamoClient.send(command);
    } catch (error) {
      throw ErrorUtil.throwError(error);
    }
  }

  /**
   * Deletes a record from a DynamoDB table.
   * @param tableName The name of the DynamoDB table.
   * @param key The primary key of the record to delete.
   */
  public static async delete(tableName: string, id: string): Promise<void> {
    const dynamoClient = await this.getDynamoClient();

    const command = new DeleteItemCommand({
      TableName: tableName,
      Key: marshall({ ID: id })
    });

    try {
      await dynamoClient.send(command);
    } catch (error) {
      throw ErrorUtil.throwError(error);
    }
  }
}
