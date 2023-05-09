export const schema = {
  type: 'object',
  required: ['songId'],
  maxProperties: 1,
  minProperties: 1,
  properties: {
    songId: {
      type: 'string',
      pattern: '^[a-zA-Z]+$',
    },
  },
};
