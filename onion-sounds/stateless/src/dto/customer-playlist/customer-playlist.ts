export type CustomerPlaylistDto = {
  id: string;
  created: string;
  updated: string;
  playlistName: string;
  songIds: string[];
};

export type NewCustomerPlaylistDto = {
  playlistName: string;
};

export type NewCustomerPlaylistSongDto = {
  songId: string;
};
