import * as publishEvent from '@adapters/secondary/event-adapter/event-adapter';
import * as retrieveAccount from '@adapters/secondary/database-adapter/database-adapter';

import {
  CustomerAccountDto,
  PaymentStatus,
  SubscriptionType,
} from '@dto/customer-account';

import { upgradeCustomerAccountUseCase } from '@use-cases/upgrade-customer-account/upgrade-customer-account';

let customerAccountDto: CustomerAccountDto;
let publishEventSpy: jest.SpyInstance;

describe('upgrade-customer-use-case', () => {
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
      .spyOn(retrieveAccount, 'retrieveAccount')
      .mockResolvedValue(customerAccountDto);

    publishEventSpy = jest
      .spyOn(publishEvent, 'publishEvent')
      .mockResolvedValue();
  });

  it('should throw an error when the payment status is invalid', async () => {
    expect.assertions(1);

    // arrange
    customerAccountDto.paymentStatus = PaymentStatus.Invalid;

    // act / assert
    await expect(
      upgradeCustomerAccountUseCase('111')
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Payment is invalid - unable to upgrade"`
    );
  });

  it('should throw an error when the subscription type is already upgraded', async () => {
    expect.assertions(1);

    // arrange
    customerAccountDto.subscriptionType = SubscriptionType.Upgraded;

    // act / assert
    await expect(
      upgradeCustomerAccountUseCase('111')
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Subscription is already upgraded - unable to upgrade"`
    );
  });

  it('should publish the event with the correct values', async () => {
    // act
    await upgradeCustomerAccountUseCase('111');

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
        playlists: [],
        subscriptionType: 'Upgraded',
        surname: 'Gilmore',
        updated: '2022-01-01T00:00:00.000Z',
      },
      'CustomerAccountUpgraded',
      'com.customer-account-onion',
      '1',
      '2022-01-01T00:00:00.000Z'
    );
  });

  it('should return the correct dto on success', async () => {
    // act
    const response = await upgradeCustomerAccountUseCase('111');
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
  "playlists": Array [],
  "subscriptionType": "Upgraded",
  "surname": "Gilmore",
  "updated": "2022-01-01T00:00:00.000Z",
}
`);
  });
});
