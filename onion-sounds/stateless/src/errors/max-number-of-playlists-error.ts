export class MaxNumberOfPlaylistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MaxNumberOfPlaylistsError';
  }
}
