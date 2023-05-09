export const schema = {
  type: 'object',
  required: ['playlistName'],
  maxProperties: 1,
  minProperties: 1,
  properties: {
    playlistName: {
      type: 'string',
      pattern: '^[a-zA-Z]+$',
    },
  },
};
