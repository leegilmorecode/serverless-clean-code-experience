import {
  CustomerAccountDto,
  PaymentStatus,
  SubscriptionType,
} from '@dto/customer-account';
import {
  createAccount,
  retrieveAccount,
  updateAccount,
} from '@adapters/secondary/database-adapter/database-adapter';

import { awsSdkGetPromiseResponse } from '../../../../../__mocks__/aws-sdk';

let customerAccount: CustomerAccountDto;

describe('database-adapter', () => {
  beforeEach(() => {
    customerAccount = {
      id: '111',
      firstName: 'Gilmore',
      surname: 'Lee',
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
  });

  describe('create-account', () => {
    it('should return the correct dto', async () => {
      await expect(createAccount(customerAccount)).resolves
        .toMatchInlineSnapshot(`
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
  "firstName": "Gilmore",
  "id": "111",
  "paymentStatus": "Valid",
  "playlists": Array [],
  "subscriptionType": "Basic",
  "surname": "Lee",
  "updated": "updated",
}
`);
    });
  });

  describe('update-account', () => {
    it('should return the correct dto', async () => {
      await expect(updateAccount(customerAccount)).resolves
        .toMatchInlineSnapshot(`
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
  "firstName": "Gilmore",
  "id": "111",
  "paymentStatus": "Valid",
  "playlists": Array [],
  "subscriptionType": "Basic",
  "surname": "Lee",
  "updated": "updated",
}
`);
    });
  });

  describe('retrieve-account', () => {
    it('should return the correct dto', async () => {
      // arrange
      awsSdkGetPromiseResponse.mockResolvedValueOnce({
        Item: {
          ...customerAccount,
        },
      });
      await expect(retrieveAccount(customerAccount.id)).resolves
        .toMatchInlineSnapshot(`
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
  "firstName": "Gilmore",
  "id": "111",
  "paymentStatus": "Valid",
  "playlists": Array [],
  "subscriptionType": "Basic",
  "surname": "Lee",
  "updated": "updated",
}
`);
    });
  });
});
