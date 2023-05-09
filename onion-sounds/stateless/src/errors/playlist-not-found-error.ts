export class PlaylistNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PlaylistNotFoundError';
  }
}
