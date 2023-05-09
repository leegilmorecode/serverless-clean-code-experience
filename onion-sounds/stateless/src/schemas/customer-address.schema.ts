export const schema = {
  type: 'object',
  required: ['addressLineOne', 'postCode'],
  maxProperties: 6,
  minProperties: 2,
  properties: {
    addressLineOne: {
      type: 'string',
      pattern: '^[a-zA-Z0-9 _.-]+$',
    },
    addressLineTwo: {
      type: 'string',
      pattern: '^[a-zA-Z0-9 _.-]+$',
    },
    addressLineThree: {
      type: 'string',
      pattern: '^[a-zA-Z0-9 _.-]+$',
    },
    addressLineFour: {
      type: 'string',
      pattern: '^[a-zA-Z0-9 _.-]+$',
    },
    addressLineFive: {
      type: 'string',
      pattern: '^[a-zA-Z0-9 _.-]+$',
    },
    postCode: {
      type: 'string',
      pattern: '^[a-zA-Z0-9 _.-]+$',
    },
  },
};
