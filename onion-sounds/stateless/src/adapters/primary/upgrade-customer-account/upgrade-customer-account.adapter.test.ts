import * as upgradeCustomerAccountUseCase from '@use-cases/upgrade-customer-account/upgrade-customer-account';

import {
  CustomerAccountDto,
  PaymentStatus,
  SubscriptionType,
} from '@dto/customer-account';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { upgradeCustomerAccountAdapter } from '@adapters/primary/upgrade-customer-account/upgrade-customer-account.adapter';

let event: Partial<APIGatewayProxyEvent>;
let customerAccount: CustomerAccountDto;

describe('upgrade-customer-account-handler', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    customerAccount = {
      id: '111',
      firstName: 'Lee',
      surname: 'Gilmore',
      subscriptionType: SubscriptionType.Upgraded,
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
      .spyOn(upgradeCustomerAccountUseCase, 'upgradeCustomerAccountUseCase')
      .mockResolvedValue(customerAccount);

    event = {
      pathParameters: {
        id: '111',
      },
    };
  });

  it('should return the correct response on success', async () => {
    // act & assert
    await expect(upgradeCustomerAccountAdapter((event as any))).resolves.
toMatchInlineSnapshot(`
Object {
  "body": "{\\"id\\":\\"111\\",\\"firstName\\":\\"Lee\\",\\"surname\\":\\"Gilmore\\",\\"subscriptionType\\":\\"Upgraded\\",\\"paymentStatus\\":\\"Valid\\",\\"created\\":\\"created\\",\\"updated\\":\\"updated\\",\\"playlists\\":[],\\"customerAddress\\":{\\"addressLineOne\\":\\"line one\\",\\"addressLineTwo\\":\\"line two\\",\\"addressLineThree\\":\\"line three\\",\\"addressLineFour\\":\\"line four\\",\\"addressLineFive\\":\\"line five\\",\\"postCode\\":\\"ne11bb\\"}}",
  "statusCode": 200,
}
`);
  });

  it('should throw an error if no path parameters', async () => {
    // arrange
    event = {
      pathParameters: null,
    };

    // act & assert
    await expect(upgradeCustomerAccountAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "\\"no id in the path parameters of the event\\"",
  "statusCode": 400,
}
`);
  });

  it('should return the correct response on error', async () => {
    // arrange
    event = {} as any;

    // act & assert
    await expect(upgradeCustomerAccountAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "\\"no id in the path parameters of the event\\"",
  "statusCode": 400,
}
`);
  });
});
