import * as createAccount from '@adapters/secondary/database-adapter/database-adapter';
import * as publishEvent from '@adapters/secondary/event-adapter/event-adapter';

import {
  CustomerAccountDto,
  NewCustomerAccountDto,
  PaymentStatus,
  SubscriptionType,
} from '@dto/customer-account';

import { createCustomerAccountUseCase } from '@use-cases/create-customer-account/create-customer-account';

let customerAccountDto: CustomerAccountDto;
let newCustomerAccountDto: NewCustomerAccountDto;
let publishEventSpy: jest.SpyInstance;

describe('create-customer-use-case', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    newCustomerAccountDto = {
      firstName: 'Lee',
      surname: 'Gilmore',
      customerAddress: {
        addressLineOne: 'line one',
        addressLineTwo: 'line two',
        addressLineThree: 'line three',
        addressLineFour: 'line four',
        addressLineFive: 'line five',
        postCode: 'ne11bb',
      },
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
      .spyOn(createAccount, 'createAccount')
      .mockResolvedValue(customerAccountDto);

    publishEventSpy = jest
      .spyOn(publishEvent, 'publishEvent')
      .mockResolvedValue();
  });

  it('should throw an error when the new customer dto is invalid', async () => {
    expect.assertions(1);

    // arrange
    newCustomerAccountDto.firstName = '±';

    // act / assert
    await expect(
      createCustomerAccountUseCase(newCustomerAccountDto)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/firstName\\",\\"schemaPath\\":\\"#/properties/firstName/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z]+$\\\\\\"\\"}]"`
    );
  });

  it('should publish the event with the correct values', async () => {
    // act
    await createCustomerAccountUseCase(newCustomerAccountDto);

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
        subscriptionType: 'Basic',
        surname: 'Gilmore',
        updated: 'updated',
      },
      'CustomerAccountCreated',
      'com.customer-account-onion',
      '1',
      '2022-01-01T00:00:00.000Z'
    );
  });

  it('should return the correct dto on success', async () => {
    // act
    const response = await createCustomerAccountUseCase(newCustomerAccountDto);
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
  "subscriptionType": "Basic",
  "surname": "Gilmore",
  "updated": "updated",
}
`);
  });
});
