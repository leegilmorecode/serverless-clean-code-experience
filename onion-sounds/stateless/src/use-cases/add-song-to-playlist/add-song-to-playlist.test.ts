import * as databaseAdapter from '@adapters/secondary/database-adapter/database-adapter';
import * as publishEvent from '@adapters/secondary/event-adapter/event-adapter';

import {
  CustomerAccountDto,
  PaymentStatus,
  SubscriptionType,
} from '@dto/customer-account';

import { NewCustomerPlaylistSongDto } from '@dto/customer-playlist';
import { addSongToPlaylistUseCase } from '@use-cases/add-song-to-playlist/add-song-to-playlist';

let customerAccountDto: CustomerAccountDto;
let newCustomerPlaylistSongDto: NewCustomerPlaylistSongDto;

let publishEventSpy: jest.SpyInstance;

describe('add-song-to-playlist-use-case', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    customerAccountDto = {
      id: '111',
      firstName: 'Lee',
      surname: 'Gilmore',
      subscriptionType: SubscriptionType.Basic,
      paymentStatus: PaymentStatus.Valid,
      created: 'created',
      updated: 'updated',
      playlists: [
        {
          id: 'f39e49ad-8f88-448f-8a15-41d560ad6d70',
          playlistName: 'existingPlaylist',
          songIds: [],
          created: 'created',
          updated: 'updated',
        },
      ],
      customerAddress: {
        addressLineOne: 'line one',
        addressLineTwo: 'line two',
        addressLineThree: 'line three',
        addressLineFour: 'line four',
        addressLineFive: 'line five',
        postCode: 'ne11bb',
      },
    };
    newCustomerPlaylistSongDto = {
      songId: 'songone',
    };

    jest
      .spyOn(databaseAdapter, 'retrieveAccount')
      .mockResolvedValue(customerAccountDto);

    jest
      .spyOn(databaseAdapter, 'updateAccount')
      .mockResolvedValue(customerAccountDto);

    publishEventSpy = jest
      .spyOn(publishEvent, 'publishEvent')
      .mockResolvedValue();
  });

  it('should throw an error if the playlist is not found', async () => {
    // act
    jest
      .spyOn(databaseAdapter, 'retrieveAccount')
      .mockResolvedValueOnce(null as any);

    // arrange / assert
    await expect(
      addSongToPlaylistUseCase(
        '111',
        'f39e49ad-8f88-448f-8a15-41d560ad6d70',
        newCustomerPlaylistSongDto
      )
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Account 111 not found"`);
  });

  it('should throw an error if the playlist song count is greater than 4', async () => {
    // act
    customerAccountDto = {
      id: '111',
      firstName: 'Lee',
      surname: 'Gilmore',
      subscriptionType: SubscriptionType.Basic,
      paymentStatus: PaymentStatus.Valid,
      created: 'created',
      updated: 'updated',
      playlists: [
        {
          id: 'f39e49ad-8f88-448f-8a15-41d560ad6d70',
          playlistName: 'existingPlaylist',
          songIds: ['1', '2', '3', '4'],
          created: 'created',
          updated: 'updated',
        },
      ],
      customerAddress: {
        addressLineOne: 'line one',
        addressLineTwo: 'line two',
        addressLineThree: 'line three',
        addressLineFour: 'line four',
        addressLineFive: 'line five',
        postCode: 'ne11bb',
      },
    };

    jest
      .spyOn(databaseAdapter, 'retrieveAccount')
      .mockResolvedValueOnce(customerAccountDto);

    // arrange / assert
    await expect(
      addSongToPlaylistUseCase(
        '111',
        'f39e49ad-8f88-448f-8a15-41d560ad6d70',
        newCustomerPlaylistSongDto
      )
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"the maximum playlist length is 4"`
    );
  });

  it('should publish the event with the correct values', async () => {
    // act
    await addSongToPlaylistUseCase(
      '111',
      'f39e49ad-8f88-448f-8a15-41d560ad6d70',
      newCustomerPlaylistSongDto
    );

    // arrange / assert
    expect(publishEventSpy).toHaveBeenCalledWith(
      {
        created: 'created',
        customerAddress: {
          addressLineFive: 'line five',
          addressLineFour: 'line four',
          addressLineOne: 'line one',
          addressLineThree: 'line three',
          addressLineTwo: 'line two',
          postCode: 'ne11bb',
        },
        firstName: 'Lee',
        id: '111',
        paymentStatus: 'Valid',
        playlists: [
          {
            created: 'created',
            id: 'f39e49ad-8f88-448f-8a15-41d560ad6d70',
            playlistName: 'existingPlaylist',
            songIds: ['songone'],
            updated: 'updated',
          },
        ],
        subscriptionType: 'Basic',
        surname: 'Gilmore',
        updated: '2022-01-01T00:00:00.000Z',
      },
      'SongAddedToPlaylist',
      'com.customer-account-onion',
      '1',
      '2022-01-01T00:00:00.000Z'
    );
  });

  it('should return the correct dto on success', async () => {
    // act
    const response = await addSongToPlaylistUseCase(
      '111',
      'f39e49ad-8f88-448f-8a15-41d560ad6d70',
      newCustomerPlaylistSongDto
    );
    // arrange / assert
    expect(response).toMatchInlineSnapshot(`
Object {
  "created": "created",
  "id": "f39e49ad-8f88-448f-8a15-41d560ad6d70",
  "playlistName": "existingPlaylist",
  "songIds": Array [
    "songone",
  ],
  "updated": "updated",
}
`);
  });
});
