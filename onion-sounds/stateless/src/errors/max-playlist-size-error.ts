export class MaxPlaylistSizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MaxPlaylistSizeError';
  }
}
