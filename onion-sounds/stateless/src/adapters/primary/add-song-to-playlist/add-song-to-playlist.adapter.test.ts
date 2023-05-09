import * as addSongToPlaylistUseCase from '@use-cases/add-song-to-playlist/add-song-to-playlist';

import {
  CustomerPlaylistDto,
  NewCustomerPlaylistSongDto,
} from '@dto/customer-playlist';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { addSongToPlaylistAdapter } from '@adapters/primary/add-song-to-playlist/add-song-to-playlist.adapter';

let event: Partial<APIGatewayProxyEvent>;
let customerPlaylist: CustomerPlaylistDto;

describe('add-song-to-playlist-handler', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    customerPlaylist = {
      id: '111',
      playlistName: 'newplaylist',
      created: 'created',
      updated: 'updated',
      songIds: ['songone'],
    };

    jest
      .spyOn(addSongToPlaylistUseCase, 'addSongToPlaylistUseCase')
      .mockResolvedValue(customerPlaylist);

    const payload: NewCustomerPlaylistSongDto = {
      songId: 'songone',
    };

    event = {
      body: JSON.stringify(payload),
      pathParameters: {
        id: '111',
        playlistId: '222',
      },
    };
  });

  it('should return the correct response on success', async () => {
    // act & assert
    await expect(addSongToPlaylistAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "{\\"id\\":\\"111\\",\\"playlistName\\":\\"newplaylist\\",\\"created\\":\\"created\\",\\"updated\\":\\"updated\\",\\"songIds\\":[\\"songone\\"]}",
  "statusCode": 201,
}
`);
  });

  it('should throw a validation error if the payload is invalid', async () => {
    // arrange
    const payload: NewCustomerPlaylistSongDto = {
      songId: '±', // invalid
    };

    event = {
      body: JSON.stringify(payload),
      pathParameters: {
        id: '111',
        playlistId: '222',
      },
    };

    // act & assert
    await expect(addSongToPlaylistAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "\\"[{\\\\\\"instancePath\\\\\\":\\\\\\"/songId\\\\\\",\\\\\\"schemaPath\\\\\\":\\\\\\"#/properties/songId/pattern\\\\\\",\\\\\\"keyword\\\\\\":\\\\\\"pattern\\\\\\",\\\\\\"params\\\\\\":{\\\\\\"pattern\\\\\\":\\\\\\"^[a-zA-Z]+$\\\\\\"},\\\\\\"message\\\\\\":\\\\\\"must match pattern \\\\\\\\\\\\\\"^[a-zA-Z]+$\\\\\\\\\\\\\\"\\\\\\"}]\\"",
  "statusCode": 400,
}
`);
  });

  it('should throw a validation error if there are no path parameters', async () => {
    // arrange
    const payload: NewCustomerPlaylistSongDto = {
      songId: 'songone',
    };

    event = {
      body: JSON.stringify(payload),
      pathParameters: null,
    };

    // act / assert
    await expect(addSongToPlaylistAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "\\"no customer account id in the path parameters of the event\\"",
  "statusCode": 400,
}
`);
  });

  it('should throw a validation error if there is no account id', async () => {
    // arrange
    const payload: NewCustomerPlaylistSongDto = {
      songId: 'songone',
    };

    event = {
      body: JSON.stringify(payload),
      pathParameters: {}, // no account id
    };

    // act & assert
    await expect(addSongToPlaylistAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "\\"no customer account id in the path parameters of the event\\"",
  "statusCode": 400,
}
`);
  });

  it('should throw a validation error if there is no playlist id', async () => {
    // arrange
    const payload: NewCustomerPlaylistSongDto = {
      songId: 'songone',
    };

    event = {
      body: JSON.stringify(payload),
      pathParameters: {
        id: '111',
      }, // no playlist id
    };

    // act & assert
    await expect(addSongToPlaylistAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "\\"no playlist id in the path parameters of the event\\"",
  "statusCode": 400,
}
`);
  });

  it('should throw a validation error if there is no body', async () => {
    // arrange
    event = {} as any;

    // act & assert
    await expect(addSongToPlaylistAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "\\"no song body\\"",
  "statusCode": 400,
}
`);
  });
});
