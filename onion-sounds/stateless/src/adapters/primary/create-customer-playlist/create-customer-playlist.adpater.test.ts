import * as createCustomerPlaylistUseCase from '@use-cases/create-customer-playlist/create-customer-playlist';

import {
  CustomerPlaylistDto,
  NewCustomerPlaylistDto,
} from '@dto/customer-playlist';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { createCustomerPlaylistAdapter } from '@adapters/primary/create-customer-playlist/create-customer-playlist.adpater';

let event: Partial<APIGatewayProxyEvent>;
let customerPlaylist: CustomerPlaylistDto;

describe('create-customer-playlist-handler', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    customerPlaylist = {
      id: '111',
      playlistName: 'newplaylist',
      created: 'created',
      updated: 'updated',
      songIds: [],
    };

    jest
      .spyOn(createCustomerPlaylistUseCase, 'createCustomerPlaylistUseCase')
      .mockResolvedValue(customerPlaylist);

    const payload: NewCustomerPlaylistDto = {
      playlistName: 'newplaylist',
    };

    event = {
      body: JSON.stringify(payload),
      pathParameters: {
        id: '111',
      },
    };
  });

  it('should return the correct response on success', async () => {
    // act & assert
    await expect(createCustomerPlaylistAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "{\\"id\\":\\"111\\",\\"playlistName\\":\\"newplaylist\\",\\"created\\":\\"created\\",\\"updated\\":\\"updated\\",\\"songIds\\":[]}",
  "statusCode": 201,
}
`);
  });

  it('should throw a validation error if the payload is invalid', async () => {
    // arrange
    const payload: NewCustomerPlaylistDto = {
      playlistName: '±', // invalid
    };

    event = {
      body: JSON.stringify(payload),
      pathParameters: {
        id: '111',
      },
    };

    // act & assert
    await expect(createCustomerPlaylistAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "\\"[{\\\\\\"instancePath\\\\\\":\\\\\\"/playlistName\\\\\\",\\\\\\"schemaPath\\\\\\":\\\\\\"#/properties/playlistName/pattern\\\\\\",\\\\\\"keyword\\\\\\":\\\\\\"pattern\\\\\\",\\\\\\"params\\\\\\":{\\\\\\"pattern\\\\\\":\\\\\\"^[a-zA-Z]+$\\\\\\"},\\\\\\"message\\\\\\":\\\\\\"must match pattern \\\\\\\\\\\\\\"^[a-zA-Z]+$\\\\\\\\\\\\\\"\\\\\\"}]\\"",
  "statusCode": 400,
}
`);
  });

  it('should throw a validation error if there is no account id', async () => {
    // arrange
    const payload: NewCustomerPlaylistDto = {
      playlistName: 'newplaylist',
    };

    event = {
      body: JSON.stringify(payload),
      pathParameters: {}, // no account id
    };

    // act & assert
    await expect(createCustomerPlaylistAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "\\"no id in the path parameters of the event\\"",
  "statusCode": 400,
}
`);
  });

  it('should throw a validation error if there is no body', async () => {
    // arrange
    event = {} as any;

    // act & assert
    await expect(createCustomerPlaylistAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "\\"no playlist body\\"",
  "statusCode": 400,
}
`);
  });
});
