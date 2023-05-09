import * as customerAccountCreatedEvent from '@events/customer-account-created';

import {
  CustomerAccountDto,
  NewCustomerAccountDto,
  PaymentStatus,
  SubscriptionType,
} from '@dto/customer-account';

import { createAccount } from '@adapters/secondary/database-adapter';
import { getISOString } from '@shared/date-utils';
import { logger } from '@packages/logger';
import { publishEvent } from '@adapters/secondary/event-adapter';
import { schema } from '@schemas/customer-account.schema';
import { schemaValidator } from '@packages/schema-validator';
import { v4 as uuid } from 'uuid';

// takes a dto and calls the use case (returning a dto to the primary adapter)
// primary adapter --> (use case) --> secondary adapter(s)

/**
 * Create a new Customer Account
 * Input: NewCustomerAccountDto
 * Output: CustomerAccountDto
 *
 * Primary course:
 *
 *  1. Validate the customer account details
 *  2. Create a new customer account
 *  3. Publish a CustomerAccountCreated event.
 */
export async function createCustomerAccountUseCase(
  newCustomer: NewCustomerAccountDto
): Promise<CustomerAccountDto> {
  const createdDate = getISOString();

  const newCustomerAccount: CustomerAccountDto = {
    id: uuid(),
    created: createdDate,
    updated: createdDate,
    subscriptionType: SubscriptionType.Basic,
    paymentStatus: PaymentStatus.Valid,
    playlists: [],
    firstName: newCustomer.firstName,
    surname: newCustomer.surname,
    customerAddress: newCustomer.customerAddress,
  };

  schemaValidator(schema, newCustomerAccount);
  logger.debug(`customer account validated for ${newCustomerAccount.id}`);

  const createdAccount = await createAccount(newCustomerAccount);
  logger.info(`customer account created for ${createdAccount.id}`);

  await publishEvent(
    createdAccount,
    customerAccountCreatedEvent.eventName,
    customerAccountCreatedEvent.eventSource,
    customerAccountCreatedEvent.eventVersion,
    createdDate
  );
  logger.info(
    `customer account created event published for ${createdAccount.id}`
  );

  return createdAccount;
}
