export const schema = {
  type: 'object',
  required: ['id', 'created', 'updated', 'playlistName', 'songIds'],
  maxProperties: 5,
  minProperties: 5,
  properties: {
    id: {
      type: 'string',
    },
    created: {
      type: 'string',
    },
    updated: {
      type: 'string',
    },
    playlistName: {
      type: 'string',
      pattern: '^[a-zA-Z]+$',
    },
    songIds: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};
