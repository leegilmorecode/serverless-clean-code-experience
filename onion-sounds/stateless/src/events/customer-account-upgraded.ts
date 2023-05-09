import { schema } from '@schemas/customer-account.schema';

export const eventName = 'CustomerAccountUpgraded';
export const eventSource = 'com.customer-account-onion';
export const eventSchema = schema;
export const eventVersion = '1';
