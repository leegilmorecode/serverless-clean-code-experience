import * as databaseAdapter from '@adapters/secondary/database-adapter/database-adapter';
import * as publishEvent from '@adapters/secondary/event-adapter/event-adapter';

import {
  CustomerAccountDto,
  PaymentStatus,
  SubscriptionType,
} from '@dto/customer-account';

import { NewCustomerPlaylistDto } from '@dto/customer-playlist';
import { createCustomerPlaylistUseCase } from '@use-cases/create-customer-playlist/create-customer-playlist';

let customerAccountDto: CustomerAccountDto;
let newPlaylistDto: NewCustomerPlaylistDto;
let publishEventSpy: jest.SpyInstance;
let retrieveAccountSpy: jest.SpyInstance;

describe('create-customer-playlist-use-case', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    newPlaylistDto = {
      playlistName: 'newPlaylist',
    };

    customerAccountDto = {
      id: '111',
      firstName: 'Lee',
      surname: 'Gilmore',
      subscriptionType: SubscriptionType.Basic,
      paymentStatus: PaymentStatus.Valid,
      created: 'created',
      updated: 'updated',
      playlists: [],
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
      .spyOn(databaseAdapter, 'updateAccount')
      .mockResolvedValue(customerAccountDto);

    retrieveAccountSpy = jest
      .spyOn(databaseAdapter, 'retrieveAccount')
      .mockResolvedValue(customerAccountDto);

    publishEventSpy = jest
      .spyOn(publishEvent, 'publishEvent')
      .mockResolvedValue();
  });

  it('should throw an error when the max number of playlists is reached', async () => {
    expect.assertions(1);

    // arrange
    const existingCustomerAccount: CustomerAccountDto = {
      ...customerAccountDto,
    };

    const newPlaylist = {
      ...newPlaylistDto,
      created: 'created',
      updated: 'updated',
      id: '111',
      songIds: [],
    };
    existingCustomerAccount.playlists.push(newPlaylist);
    existingCustomerAccount.playlists.push(newPlaylist);
    existingCustomerAccount.playlists.push(newPlaylist);

    retrieveAccountSpy.mockResolvedValueOnce(existingCustomerAccount);

    // act / assert
    await expect(
      createCustomerPlaylistUseCase('111', newPlaylistDto)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"maximum number of playlists reached"`
    );
  });

  it('should throw an error when the new playlist is not valid', async () => {
    expect.assertions(1);

    // arrange
    newPlaylistDto.playlistName = '±';

    // act / assert
    await expect(
      createCustomerPlaylistUseCase('111', newPlaylistDto)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/playlists/0/playlistName\\",\\"schemaPath\\":\\"#/properties/playlists/items/properties/playlistName/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z]+$\\\\\\"\\"}]"`
    );
  });

  it('should publish the event with the correct values', async () => {
    // act
    await createCustomerPlaylistUseCase('111', newPlaylistDto);

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
            created: '2022-01-01T00:00:00.000Z',
            id: 'f39e49ad-8f88-448f-8a15-41d560ad6d70',
            playlistName: 'newPlaylist',
            songIds: [],
            updated: '2022-01-01T00:00:00.000Z',
          },
        ],
        subscriptionType: 'Basic',
        surname: 'Gilmore',
        updated: '2022-01-01T00:00:00.000Z',
      },
      'CustomerPlaylistCreated',
      'com.customer-account-onion',
      '1',
      '2022-01-01T00:00:00.000Z'
    );
  });

  it('should return the correct dto on success', async () => {
    // act
    const response = await createCustomerPlaylistUseCase('111', newPlaylistDto);
    // arrange / assert
    expect(response).toMatchInlineSnapshot(`
Object {
  "created": "2022-01-01T00:00:00.000Z",
  "id": "f39e49ad-8f88-448f-8a15-41d560ad6d70",
  "playlistName": "newPlaylist",
  "songIds": Array [],
  "updated": "2022-01-01T00:00:00.000Z",
}
`);
  });
});
