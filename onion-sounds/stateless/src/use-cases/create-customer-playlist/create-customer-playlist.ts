import * as customerPlaylistCreatedEvent from '@events/customer-playlist-created';

import {
  CustomerPlaylistDto,
  NewCustomerPlaylistDto,
} from '@dto/customer-playlist';
import {
  retrieveAccount,
  updateAccount,
} from '@adapters/secondary/database-adapter';

import { CustomerAccountDto } from '@dto/customer-account';
import { MaxNumberOfPlaylistsError } from '@errors/max-number-of-playlists-error';
import { getISOString } from '@shared/date-utils';
import { logger } from '@packages/logger';
import { publishEvent } from '@adapters/secondary/event-adapter';
import { schema } from '@schemas/customer-account.schema';
import { schemaValidator } from '@packages/schema-validator';
import { v4 as uuid } from 'uuid';

// primary adapter --> (use case) --> secondary adapter(s)

/**
 * Create a new Customer Playlist
 * Input: accountId, playlist
 * Output: CustomerPlaylistDto
 *
 * Primary course:
 *
 *  1. Retrieve the customer account
 *  2. Create and add the new customer playlist to the account
 *  3. Save the changes as a whole (aggregate root)
 *  4. Publish a CustomerPlaylistCreated event.
 */
export async function createCustomerPlaylistUseCase(
  accountId: string,
  playlist: NewCustomerPlaylistDto
): Promise<CustomerPlaylistDto> {
  const updatedDate = getISOString();

  const existingAccount: CustomerAccountDto = await retrieveAccount(accountId);

  // validation that we are not at the max number of playlists before adding another
  if (existingAccount.playlists.length >= 2) {
    throw new MaxNumberOfPlaylistsError('maximum number of playlists reached');
  }

  // create the new playlist
  const newPlaylist: CustomerPlaylistDto = {
    id: uuid(),
    playlistName: playlist.playlistName,
    created: updatedDate,
    updated: updatedDate,
    songIds: [],
  };

  existingAccount.playlists.push(newPlaylist);
  existingAccount.updated = updatedDate;

  // validate before saving
  schemaValidator(schema, existingAccount);
  logger.debug(`customer playlist validated for ${existingAccount.id}`);

  // persist the full aggregate root i.e. both entities (we can't update one on its own)
  await updateAccount(existingAccount);

  logger.info(
    `customer playlist ${newPlaylist.id} created for ${existingAccount.id}`
  );

  await publishEvent(
    existingAccount,
    customerPlaylistCreatedEvent.eventName,
    customerPlaylistCreatedEvent.eventSource,
    customerPlaylistCreatedEvent.eventVersion,
    updatedDate
  );
  logger.info(`new playlist created event published for ${existingAccount.id}`);

  return newPlaylist;
}
