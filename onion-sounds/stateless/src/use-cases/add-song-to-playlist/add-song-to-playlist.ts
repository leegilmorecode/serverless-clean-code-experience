import * as songAddedToPlaylistEvent from '@events/song-added-to-playlist';

import {
  CustomerPlaylistDto,
  NewCustomerPlaylistSongDto,
} from '@dto/customer-playlist';
import {
  retrieveAccount,
  updateAccount,
} from '@adapters/secondary/database-adapter';

import { CustomerAccountDto } from '@dto/customer-account';
import { MaxPlaylistSizeError } from '@errors/max-playlist-size-error';
import { PlaylistNotFoundError } from '@errors/playlist-not-found-error';
import { ResourceNotFoundError } from '@errors/resource-not-found';
import { getISOString } from '@shared/date-utils';
import { logger } from '@packages/logger';
import { publishEvent } from '@adapters/secondary/event-adapter';

const getPlaylistById = (
  existingAccount: CustomerAccountDto,
  playlistId: string
): CustomerPlaylistDto => {
  const playlist = existingAccount.playlists.find(
    (playlist: CustomerPlaylistDto) => playlist.id === playlistId
  );

  if (playlist === undefined) {
    throw new PlaylistNotFoundError(`Playlist ${playlistId} not found`);
  }
  return playlist;
};

// primary adapter --> (use case) --> secondary adapter(s)

/**
 * Adds a song to a Customer Playlist
 * Input: accountId, playlistId
 * Output: CustomerPlaylistDto
 *
 * Primary course:
 *
 *  1. Retrieve the customer account
 *  2. Add the song to the playlist
 *  3. Save the changes as a whole (aggregate root)
 *  4. Publish a SongAddedToPlaylist event.
 */
export async function addSongToPlaylistUseCase(
  accountId: string,
  playlistId: string,
  song: NewCustomerPlaylistSongDto
): Promise<CustomerPlaylistDto> {
  const updatedDate = getISOString();

  const existingAccount: CustomerAccountDto = await retrieveAccount(accountId);

  if (!existingAccount) {
    throw new ResourceNotFoundError(`Account ${accountId} not found`);
  }

  // check the playlist exists before adding the song to it
  getPlaylistById(existingAccount, playlistId);

  // add the song to the playlist
  existingAccount.playlists
    .find((playlist: CustomerPlaylistDto) => playlist.id === playlistId)
    ?.songIds.push(song.songId);

  existingAccount.updated = updatedDate;

  if (getPlaylistById(existingAccount, playlistId).songIds.length >= 3) {
    throw new MaxPlaylistSizeError('the maximum playlist length is 4');
  }

  // persist the full aggregate root i.e. all entities (we can't update one on its own)
  await updateAccount(existingAccount);

  await publishEvent(
    existingAccount,
    songAddedToPlaylistEvent.eventName,
    songAddedToPlaylistEvent.eventSource,
    songAddedToPlaylistEvent.eventVersion,
    updatedDate
  );
  logger.info(`new playlist created event published for ${existingAccount.id}`);

  return existingAccount.playlists.find(
    (playlist: CustomerPlaylistDto) => playlist.id === playlistId
  ) as CustomerPlaylistDto;
}
