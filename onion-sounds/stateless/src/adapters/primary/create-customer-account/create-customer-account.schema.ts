export const schema = {
  type: 'object',
  required: ['firstName', 'surname', 'customerAddress'],
  maxProperties: 3,
  minProperties: 3,
  properties: {
    firstName: {
      type: 'string',
      pattern: '^[a-zA-Z]+$',
    },
    surname: {
      type: 'string',
      pattern: '^[a-zA-Z]+$',
    },
    customerAddress: {
      type: 'object',
      required: ['addressLineOne', 'postCode'],
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
    },
  },
};
