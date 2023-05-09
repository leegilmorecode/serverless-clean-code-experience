import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  MetricUnits,
  Metrics,
  logMetrics,
} from '@aws-lambda-powertools/metrics';
import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer';

import { CustomerAccountDto } from '@dto/customer-account';
import { ValidationError } from '@errors/validation-error';
import { errorHandler } from '@packages/apigw-error-handler';
import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { logger } from '@packages/logger';
import middy from '@middy/core';
import { upgradeCustomerAccountUseCase } from '@use-cases/upgrade-customer-account';

const tracer = new Tracer();
const metrics = new Metrics();

// (primary adapter) --> use case --> secondary adapters(s)
export const upgradeCustomerAccountAdapter = async ({
  pathParameters,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!pathParameters || !pathParameters?.id)
      throw new ValidationError('no id in the path parameters of the event');

    const { id } = pathParameters;

    logger.info(`customer account id: ${id}`);

    const customerAccount: CustomerAccountDto =
      await upgradeCustomerAccountUseCase(id);

    logger.info(
      `upgraded customer account: ${JSON.stringify(customerAccount)}`
    );

    metrics.addMetric(
      'SuccessfulCustomerAccountUpgraded',
      MetricUnits.Count,
      1
    );
    metrics.addMetadata('CustomerAccountId', id);

    return {
      statusCode: 200,
      body: JSON.stringify(customerAccount),
    };
  } catch (error) {
    return errorHandler(error);
  }
};

export const handler = middy(upgradeCustomerAccountAdapter)
  .use(injectLambdaContext(logger))
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics));
