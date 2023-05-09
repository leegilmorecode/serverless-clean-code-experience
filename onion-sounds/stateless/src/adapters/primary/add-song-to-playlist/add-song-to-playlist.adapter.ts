import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  CustomerPlaylistDto,
  NewCustomerPlaylistSongDto,
} from '@dto/customer-playlist';
import {
  MetricUnits,
  Metrics,
  logMetrics,
} from '@aws-lambda-powertools/metrics';
import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer';

import { ValidationError } from '@errors/validation-error';
import { addSongToPlaylistUseCase } from '@use-cases/add-song-to-playlist';
import { errorHandler } from '@packages/apigw-error-handler';
import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { logger } from '@packages/logger';
import middy from '@middy/core';
import { schema } from './add-song-to-playlist.schema';
import { schemaValidator } from '@packages/schema-validator';

const tracer = new Tracer();
const metrics = new Metrics();

// (primary adapter) --> use case --> secondary adapter(s)
export const addSongToPlaylistAdapter = async ({
  body,
  pathParameters,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!body) throw new ValidationError('no song body');
    if (!pathParameters || !pathParameters?.id)
      throw new ValidationError(
        'no customer account id in the path parameters of the event'
      );
    if (!pathParameters || !pathParameters?.playlistId)
      throw new ValidationError(
        'no playlist id in the path parameters of the event'
      );

    const { id, playlistId } = pathParameters;

    logger.info(`customer account id: ${id}, playlist id: ${playlistId}`);

    const newCustomerPlaylistSong: NewCustomerPlaylistSongDto =
      JSON.parse(body);

    schemaValidator(schema, newCustomerPlaylistSong);

    const updatedPlaylist: CustomerPlaylistDto = await addSongToPlaylistUseCase(
      id,
      playlistId,
      newCustomerPlaylistSong
    );

    logger.info(
      `song ${newCustomerPlaylistSong.songId} added to playlist ${playlistId} for account ${id}`
    );

    metrics.addMetric('SuccessfulAddSongToPlaylist', MetricUnits.Count, 1);

    return {
      statusCode: 201,
      body: JSON.stringify(updatedPlaylist),
    };
  } catch (error) {
    return errorHandler(error);
  }
};

export const handler = middy(addSongToPlaylistAdapter)
  .use(injectLambdaContext(logger))
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics));
