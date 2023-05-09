import { MaxNumberOfPlaylistsError } from '@errors/max-number-of-playlists-error';
import { MaxPlaylistSizeError } from '@errors/max-playlist-size-error';
import { PaymentInvalidError } from '@errors/payment-invalid-error';
import { PlaylistNotFoundError } from '@errors/playlist-not-found-error';
import { ResourceNotFoundError } from '@errors/resource-not-found';
import { SubscriptionAlreadyUpgradedError } from '@errors/subscription-already-upgraded-error';
import { ValidationError } from '@errors/validation-error';
import { errorHandler } from './error-handler';

describe('error-handler', () => {
  it('should default the error and status code on unknown instance type', () => {
    // arrange
    const error = null;

    // act / assert
    expect(errorHandler(error)).toMatchInlineSnapshot(`
Object {
  "body": "\\"An error has occurred\\"",
  "statusCode": 500,
}
`);
  });

  it('should default the error and status code on unknown error', () => {
    // arrange
    const error = new Error('unknown error');

    // act / assert
    expect(errorHandler(error)).toMatchInlineSnapshot(`
Object {
  "body": "\\"An error has occurred\\"",
  "statusCode": 500,
}
`);
  });

  it('should return the correct response on ValidationError', () => {
    // arrange
    const error = new ValidationError('this is a validation error');

    // act / assert
    expect(errorHandler(error)).toMatchInlineSnapshot(`
Object {
  "body": "\\"this is a validation error\\"",
  "statusCode": 400,
}
`);
  });

  it('should return the correct response on PaymentInvalidError', () => {
    // arrange
    const error = new PaymentInvalidError('this is a payment invalid error');

    // act / assert
    expect(errorHandler(error)).toMatchInlineSnapshot(`
Object {
  "body": "\\"this is a payment invalid error\\"",
  "statusCode": 400,
}
`);
  });

  it('should return the correct response on PaymentInvalidError', () => {
    // arrange
    const error = new MaxNumberOfPlaylistsError('max number of playlists');

    // act / assert
    expect(errorHandler(error)).toMatchInlineSnapshot(`
Object {
  "body": "\\"max number of playlists\\"",
  "statusCode": 400,
}
`);
  });

  it('should return the correct response on PaymentInvalidError', () => {
    // arrange
    const error = new MaxPlaylistSizeError('max playlist size');

    // act / assert
    expect(errorHandler(error)).toMatchInlineSnapshot(`
Object {
  "body": "\\"max playlist size\\"",
  "statusCode": 400,
}
`);
  });

  it('should return the correct response on PlaylistNotFoundError', () => {
    // arrange
    const error = new PlaylistNotFoundError('playlist not found');

    // act / assert
    expect(errorHandler(error)).toMatchInlineSnapshot(`
Object {
  "body": "\\"playlist not found\\"",
  "statusCode": 400,
}
`);
  });

  it('should return the correct response on SubscriptionAlreadyUpgradedError', () => {
    // arrange
    const error = new SubscriptionAlreadyUpgradedError(
      'account already upgraded'
    );

    // act / assert
    expect(errorHandler(error)).toMatchInlineSnapshot(`
Object {
  "body": "\\"account already upgraded\\"",
  "statusCode": 400,
}
`);
  });

  it('should return the correct response on ResourceNotFoundError', () => {
    // arrange
    const error = new ResourceNotFoundError('account with id 444 not found');

    // act / assert
    expect(errorHandler(error)).toMatchInlineSnapshot(`
Object {
  "body": "\\"account with id 444 not found\\"",
  "statusCode": 404,
}
`);
  });
});
