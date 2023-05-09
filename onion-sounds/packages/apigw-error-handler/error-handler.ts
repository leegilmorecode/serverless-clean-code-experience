import { APIGatewayProxyResult } from 'aws-lambda';
import { logger } from '@packages/logger';

// we would typically use middy - but to keep this simple to read
// without mutliple additional packages lets build outselves
export function errorHandler(error: Error | unknown): APIGatewayProxyResult {
  console.error(error);

  let errorMessage: string;
  let statusCode: number;

  if (error instanceof Error) {
    switch (error.name) {
      case 'PaymentInvalidError':
      case 'SubscriptionAlreadyUpgradedError':
      case 'ValidationError':
      case 'MaxNumberOfPlaylistsError':
      case 'MaxPlaylistSizeError':
      case 'PlaylistNotFoundError':
        errorMessage = error.message;
        statusCode = 400;
        break;
      case 'ResourceNotFound':
        errorMessage = error.message;
        statusCode = 404;
        break;
      default:
        errorMessage = 'An error has occurred';
        statusCode = 500;
        break;
    }
  } else {
    errorMessage = 'An error has occurred';
    statusCode = 500;
  }

  logger.error(errorMessage);

  return {
    statusCode: statusCode,
    body: JSON.stringify(errorMessage),
  };
}
