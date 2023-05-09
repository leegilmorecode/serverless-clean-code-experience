import { schema } from '@schemas/customer-playlist.schema';

export const eventName = 'SongAddedToPlaylist';
export const eventSource = 'com.customer-account-onion';
export const eventSchema = schema;
export const eventVersion = '1';
