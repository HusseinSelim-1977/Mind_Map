import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, QueryCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true, convertEmptyValues: false }
});

export const db = {
  get: async (TableName: string, Key: Record<string, any>) => {
    const { Item } = await docClient.send(new GetCommand({ TableName, Key }));
    return Item;
  },
  put: async (TableName: string, Item: Record<string, any>) => {
    await docClient.send(new PutCommand({ TableName, Item }));
    return Item;
  },
  delete: async (TableName: string, Key: Record<string, any>) => {
    await docClient.send(new DeleteCommand({ TableName, Key }));
  },
  query: async (TableName: string, IndexName: string | undefined, KeyConditionExpression: string, ExpressionAttributeValues: Record<string, any>) => {
    const { Items } = await docClient.send(new QueryCommand({ TableName, IndexName, KeyConditionExpression, ExpressionAttributeValues }));
    return Items || [];
  },
  scan: async (TableName: string, Limit: number = 100) => {
    const { Items } = await docClient.send(new ScanCommand({ TableName, Limit }));
    return Items || [];
  },
  update: async (TableName: string, Key: Record<string, any>, UpdateExpression: string, ExpressionAttributeValues: Record<string, any>, ExpressionAttributeNames?: Record<string, string>) => {
    const { Attributes } = await docClient.send(new UpdateCommand({ TableName, Key, UpdateExpression, ExpressionAttributeValues, ExpressionAttributeNames, ReturnValues: 'ALL_NEW' }));
    return Attributes;
  }
};
