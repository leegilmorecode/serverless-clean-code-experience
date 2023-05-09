import * as retrieveCustomerAccountUseCase from '@use-cases/retrieve-customer-account/retrieve-customer-account';

import {
  CustomerAccountDto,
  PaymentStatus,
  SubscriptionType,
} from '@dto/customer-account';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { retrieveCustomerAccountAdapter } from '@adapters/primary/retrieve-customer-account/retrieve-customer-account.adapter';

let event: Partial<APIGatewayProxyEvent>;
let customerAccount: CustomerAccountDto;

describe('retrieve-customer-account-handler', () => {
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

    jest
      .spyOn(retrieveCustomerAccountUseCase, 'retrieveCustomerAccountUseCase')
      .mockResolvedValue(customerAccount);

    event = {
      pathParameters: {
        id: '111',
      },
    };
  });

  it('should return the correct response on success', async () => {
    // act & assert
    await expect(retrieveCustomerAccountAdapter((event as any))).resolves.
toMatchInlineSnapshot(`
Object {
  "body": "{\\"id\\":\\"111\\",\\"firstName\\":\\"Lee\\",\\"surname\\":\\"Gilmore\\",\\"subscriptionType\\":\\"Basic\\",\\"paymentStatus\\":\\"Valid\\",\\"created\\":\\"created\\",\\"updated\\":\\"updated\\",\\"playlists\\":[{\\"id\\":\\"2222\\",\\"songIds\\":[\\"111\\",\\"222\\"],\\"playlistName\\":\\"playlistOne\\",\\"created\\":\\"created\\",\\"updated\\":\\"updated\\"}],\\"customerAddress\\":{\\"addressLineOne\\":\\"line one\\",\\"addressLineTwo\\":\\"line two\\",\\"addressLineThree\\":\\"line three\\",\\"addressLineFour\\":\\"line four\\",\\"addressLineFive\\":\\"line five\\",\\"postCode\\":\\"ne11bb\\"}}",
  "statusCode": 200,
}
`);
  });

  it('should return the correct response on error', async () => {
    // arrange
    event = {} as any;

    // act & assert
    await expect(retrieveCustomerAccountAdapter(event as any)).resolves
      .toMatchInlineSnapshot(`
Object {
  "body": "\\"no id in the path parameters of the event\\"",
  "statusCode": 400,
}
`);
  });
});
