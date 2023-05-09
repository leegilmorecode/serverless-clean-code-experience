import * as createCustomerAccountUseCase from '@use-cases/create-customer-account/create-customer-account';

import {
  CustomerAccountDto,
  NewCustomerAccountDto,
  PaymentStatus,
  SubscriptionType,
} from '@dto/customer-account';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { createCustomerAccountAdapter } from '@adapters/primary/create-customer-account/create-customer-account.adapter';

let event: Partial<APIGatewayProxyEvent>;
let customerAccount: CustomerAccountDto;

describe('create-customer-account-handler', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    customerAccount = {
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
      .spyOn(createCustomerAccountUseCase, 'createCustomerAccountUseCase')
      .mockResolvedValue(customerAccount);

    const payload: NewCustomerAccountDto = {
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

    event = {
      body: JSON.stringify(payload),
    };
  });

  it('should return the correct response on success', async () => {
    // act & assert
    await expect(createCustomerAccountAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "{\\"id\\":\\"111\\",\\"firstName\\":\\"Lee\\",\\"surname\\":\\"Gilmore\\",\\"subscriptionType\\":\\"Basic\\",\\"paymentStatus\\":\\"Valid\\",\\"created\\":\\"created\\",\\"updated\\":\\"updated\\",\\"playlists\\":[],\\"customerAddress\\":{\\"addressLineOne\\":\\"line one\\",\\"addressLineTwo\\":\\"line two\\",\\"addressLineThree\\":\\"line three\\",\\"addressLineFour\\":\\"line four\\",\\"addressLineFive\\":\\"line five\\",\\"postCode\\":\\"ne11bb\\"}}",
  "statusCode": 201,
}
`);
  });

  it('should throw a validation error if the payload is invalid', async () => {
    // arrange
    const payload: NewCustomerAccountDto = {
      firstName: '', // invalid
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

    event = {
      body: JSON.stringify(payload),
    };

    // act & assert
    await expect(createCustomerAccountAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "\\"[{\\\\\\"instancePath\\\\\\":\\\\\\"/firstName\\\\\\",\\\\\\"schemaPath\\\\\\":\\\\\\"#/properties/firstName/pattern\\\\\\",\\\\\\"keyword\\\\\\":\\\\\\"pattern\\\\\\",\\\\\\"params\\\\\\":{\\\\\\"pattern\\\\\\":\\\\\\"^[a-zA-Z]+$\\\\\\"},\\\\\\"message\\\\\\":\\\\\\"must match pattern \\\\\\\\\\\\\\"^[a-zA-Z]+$\\\\\\\\\\\\\\"\\\\\\"}]\\"",
  "statusCode": 400,
}
`);
  });

  it('should return the correct response on error', async () => {
    // arrange
    event = {} as any;

    // act & assert
    await expect(createCustomerAccountAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "\\"no order body\\"",
  "statusCode": 400,
}
`);
  });
});
