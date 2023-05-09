import { CustomerAccountDto } from '@dto/customer-account';
import { logger } from '@packages/logger';
import { retrieveAccount } from '@adapters/secondary/database-adapter';
import { schema } from '@schemas/customer-account.schema';
import { schemaValidator } from '@packages/schema-validator';

// primary adapter --> (use case) --> secondary adapter(s)

/**
 * Retrive a Customer Account
 * Input: Customer account ID
 * Output: CustomerAccountDto
 *
 * Primary course:
 *
 *  1.Retrieve the customer account based on ID
 */
export async function retrieveCustomerAccountUseCase(
  id: string
): Promise<CustomerAccountDto> {
  const customerAccount: CustomerAccountDto = await retrieveAccount(id);

  logger.info(`retrieved customer account for ${id}`);

  schemaValidator(schema, customerAccount);
  logger.debug(`customer account validated for ${customerAccount.id}`);

  return customerAccount;
}
