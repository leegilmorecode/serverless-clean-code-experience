import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  CustomerAccountDto,
  NewCustomerAccountDto,
} from '@dto/customer-account';
import {
  MetricUnits,
  Metrics,
  logMetrics,
} from '@aws-lambda-powertools/metrics';
import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer';

import { ValidationError } from '@errors/validation-error';
import { createCustomerAccountUseCase } from '@use-cases/create-customer-account';
import { errorHandler } from '@packages/apigw-error-handler';
import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { logger } from '@packages/logger';
import middy from '@middy/core';
import { schema } from './create-customer-account.schema';
import { schemaValidator } from '@packages/schema-validator';

const tracer = new Tracer();
const metrics = new Metrics();

// (primary adapter) --> use case --> (secondary adapter)
export const createCustomerAccountAdapter = async ({
  body,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!body) throw new ValidationError('no order body');

    const customerAccount: NewCustomerAccountDto = JSON.parse(body);

    schemaValidator(schema, customerAccount);
    logger.info(`customer account: ${JSON.stringify(customerAccount)}`);

    const createdAccount: CustomerAccountDto =
      await createCustomerAccountUseCase(customerAccount);

    logger.info(`customer account created: ${JSON.stringify(createdAccount)}`);

    metrics.addMetric('SuccessfulCustomerAccountCreated', MetricUnits.Count, 1);

    return {
      statusCode: 201,
      body: JSON.stringify(createdAccount),
    };
  } catch (error) {
    return errorHandler(error);
  }
};

export const handler = middy(createCustomerAccountAdapter)
  .use(injectLambdaContext(logger))
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics));
