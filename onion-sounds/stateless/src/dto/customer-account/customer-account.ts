import { CustomerAddressDto } from '@dto/customer-address';
import { CustomerPlaylistDto } from '@dto/customer-playlist';

export enum SubscriptionType {
  Basic = 'Basic',
  Upgraded = 'Upgraded',
}

export enum PaymentStatus {
  Valid = 'Valid',
  Invalid = 'Invalid',
}

export type CreateCustomerAccountDto = {
  id?: string;
  created?: string;
  updated?: string;
  firstName: string;
  surname: string;
  subscriptionType: SubscriptionType;
  paymentStatus: PaymentStatus;
  customerAddress: CustomerAddressDto;
};

export type CustomerAccountDto = {
  id: string;
  created: string;
  updated: string;
  firstName: string;
  surname: string;
  subscriptionType: SubscriptionType;
  paymentStatus: PaymentStatus;
  playlists: CustomerPlaylistDto[];
  customerAddress: CustomerAddressDto;
};

export type NewCustomerAccountDto = {
  firstName: string;
  surname: string;
  customerAddress: CustomerAddressDto;
};
