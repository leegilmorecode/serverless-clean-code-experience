import * as customerAccountUpgradedEvent from '@events/customer-account-upgraded';

import {
  CustomerAccountDto,
  PaymentStatus,
  SubscriptionType,
} from '@dto/customer-account';
import {
  retrieveAccount,
  updateAccount,
} from '@adapters/secondary/database-adapter';

import { PaymentInvalidError } from '@errors/payment-invalid-error';
import { SubscriptionAlreadyUpgradedError } from '@errors/subscription-already-upgraded-error';
import { getISOString } from '@shared/date-utils';
import { logger } from '@packages/logger';
import { publishEvent } from '@adapters/secondary/event-adapter';
import { schema } from '@schemas/customer-account.schema';
import { schemaValidator } from '@packages/schema-validator';

// primary adapter --> (use case) --> secondary adapter(s)

/**
 * Upgrade an existing Customer Account
 * Input: Customer account ID
 * Output: CustomerAccountDto
 *
 * Primary course:
 *
 *  1. Retrieve the customer account based on ID
 *  2. Upgrade and validate the customer account
 *  3. Publish a CustomerAccountUpdated event.
 */
export async function upgradeCustomerAccountUseCase(
  id: string
): Promise<CustomerAccountDto> {
  const updatedDate = getISOString();

  const customerAccount: CustomerAccountDto = await retrieveAccount(id);

  if (customerAccount.paymentStatus === PaymentStatus.Invalid) {
    throw new PaymentInvalidError('Payment is invalid - unable to upgrade');
  }

  // we can not upgrade an account which is already upgraded
  if (customerAccount.subscriptionType === SubscriptionType.Upgraded) {
    throw new SubscriptionAlreadyUpgradedError(
      'Subscription is already upgraded - unable to upgrade'
    );
  }

  // upgrade the account
  customerAccount.subscriptionType = SubscriptionType.Upgraded;
  customerAccount.updated = updatedDate;

  // validate the account before saving it so it is always valid
  schemaValidator(schema, customerAccount);
  logger.debug(`customer account validated for ${customerAccount.id}`);

  await updateAccount(customerAccount);
  logger.info(`customer account ${id} upgraded`);

  await publishEvent(
    customerAccount,
    customerAccountUpgradedEvent.eventName,
    customerAccountUpgradedEvent.eventSource,
    customerAccountUpgradedEvent.eventVersion,
    updatedDate
  );
  logger.info(
    `customer account upgraded event published for ${customerAccount.id}`
  );

  return customerAccount;
}
