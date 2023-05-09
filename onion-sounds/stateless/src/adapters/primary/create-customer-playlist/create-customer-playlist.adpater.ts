import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  CustomerPlaylistDto,
  NewCustomerPlaylistDto,
} from '@dto/customer-playlist';
import {
  MetricUnits,
  Metrics,
  logMetrics,
} from '@aws-lambda-powertools/metrics';
import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer';

import { ValidationError } from '@errors/validation-error';
import { createCustomerPlaylistUseCase } from '@use-cases/create-customer-playlist';
import { errorHandler } from '@packages/apigw-error-handler';
import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { logger } from '@packages/logger';
import middy from '@middy/core';
import { schema } from './create-customer-playlist.schema';
import { schemaValidator } from '@packages/schema-validator';

const tracer = new Tracer();
const metrics = new Metrics();

// (adapter) --> use case --> secondary adapter(s)
export const createCustomerPlaylistAdapter = async ({
  body,
  pathParameters,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!body) throw new ValidationError('no playlist body');
    if (!pathParameters || !pathParameters?.id)
      throw new ValidationError('no id in the path parameters of the event');

    const { id } = pathParameters;

    logger.info(`customer account id: ${id}`);

    const customerPlaylist: NewCustomerPlaylistDto = JSON.parse(body);

    schemaValidator(schema, customerPlaylist);

    logger.info(`customer account: ${JSON.stringify(customerPlaylist)}`);

    const createdAccount: CustomerPlaylistDto =
      await createCustomerPlaylistUseCase(id, customerPlaylist);

    logger.info(`customer account created: ${JSON.stringify(createdAccount)}`);

    metrics.addMetric(
      'SuccessfulCustomerPlaylistCreated',
      MetricUnits.Count,
      1
    );

    return {
      statusCode: 201,
      body: JSON.stringify(createdAccount),
    };
  } catch (error) {
    return errorHandler(error);
  }
};

export const handler = middy(createCustomerPlaylistAdapter)
  .use(injectLambdaContext(logger))
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics));
