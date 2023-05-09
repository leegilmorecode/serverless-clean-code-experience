import * as AWS from 'aws-sdk';

import { CustomerAccountDto } from '@dto/customer-account';
import { config } from '@config/config';
import { logger } from '@packages/logger';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// this is the secondary adapter which creates the account from the db
// Note: you would typically use a module or package here to interact
// with the database technology - for example dynamoose

// primary adapter --> use case --> (secondary adapter)
export async function createAccount(
  customerAccount: CustomerAccountDto
): Promise<CustomerAccountDto> {
  const tableName = config.get('tableName');

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: tableName,
    Item: customerAccount,
  };

  await dynamoDb.put(params).promise();
  logger.info(`Customer account ${customerAccount.id} stored in ${tableName}`);

  return customerAccount;
}

// this is the secondary adapter which updates the account in the db
// primary adapter --> use case --> (secondary adapter)
export async function updateAccount(
  customerAccount: CustomerAccountDto
): Promise<CustomerAccountDto> {
  const tableName = config.get('tableName');

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: tableName,
    Item: customerAccount,
  };

  await dynamoDb.put(params).promise();
  logger.info(`Customer account ${customerAccount.id} updated in ${tableName}`);

  return customerAccount;
}

// this is the secondary adapter which retrieves the account from the db
// primary adapter --> use case --> (secondary adapter)
export async function retrieveAccount(id: string): Promise<CustomerAccountDto> {
  const tableName = config.get('tableName');

  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: tableName,
    Key: {
      id,
    },
  };

  const { Item: item } = await dynamoDb.get(params).promise();

  const customer: CustomerAccountDto = {
    ...(item as CustomerAccountDto),
  };

  logger.info(`Customer account ${customer.id} retrieved from ${tableName}`);

  return customer;
}
