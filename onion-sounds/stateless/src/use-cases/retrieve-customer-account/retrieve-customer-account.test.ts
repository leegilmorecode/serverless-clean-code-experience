import * as retrieveAccount from '@adapters/secondary/database-adapter/database-adapter';

import {
  CustomerAccountDto,
  PaymentStatus,
  SubscriptionType,
} from '@dto/customer-account';

import { retrieveCustomerAccountUseCase } from '@use-cases/retrieve-customer-account/retrieve-customer-account';

let customerAccountDto: CustomerAccountDto;
let retrieveAccountSpy: jest.SpyInstance;

describe('retrieve-customer-use-case', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));
  });

  afterAll(() => {
    jest.clearAllMocks();
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
          id: '2222',
          songIds: ['111', '222'],
          playlistName: 'playlistOne',
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

    retrieveAccountSpy = jest
      .spyOn(retrieveAccount, 'retrieveAccount')
      .mockResolvedValue(customerAccountDto);
  });

  it('should return an error if the customer account is not valid', async () => {
    expect.assertions(1);

    // arrange
    customerAccountDto.firstName = '±';
    retrieveAccountSpy.mockResolvedValueOnce(customerAccountDto);

    // act / assert
    await expect(
retrieveCustomerAccountUseCase('111')).
rejects.toThrowErrorMatchingInlineSnapshot(`"[{\\"instancePath\\":\\"/firstName\\",\\"schemaPath\\":\\"#/properties/firstName/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z]+$\\\\\\"\\"}]"`);
  });

  it('should return the correct dto on success', async () => {
    // act
    const response = await retrieveCustomerAccountUseCase('111');
    // arrange / assert
    expect(response).toMatchInlineSnapshot(`
Object {
  "created": "created",
  "customerAddress": Object {
    "addressLineFive": "line five",
    "addressLineFour": "line four",
    "addressLineOne": "line one",
    "addressLineThree": "line three",
    "addressLineTwo": "line two",
    "postCode": "ne11bb",
  },
  "firstName": "Lee",
  "id": "111",
  "paymentStatus": "Valid",
  "playlists": Array [
    Object {
      "created": "created",
      "id": "2222",
      "playlistName": "playlistOne",
      "songIds": Array [
        "111",
        "222",
      ],
      "updated": "updated",
    },
  ],
  "subscriptionType": "Basic",
  "surname": "Gilmore",
  "updated": "updated",
}
`);
  });
});
