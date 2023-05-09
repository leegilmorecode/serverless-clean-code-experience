import { CustomerAddressDto } from '@dto/customer-address';
import { schema } from './customer-address.schema';
import { schemaValidator } from '../../../packages/schema-validator';

let body: CustomerAddressDto = {
  addressLineOne: 'line one',
  addressLineTwo: 'line two',
  addressLineThree: 'line three',
  addressLineFour: 'line four',
  addressLineFive: 'line five',
  postCode: 'ne11bb',
};

describe('customer-address-schema', () => {
  it('should validate correctly with the correct payload', () => {
    expect(() => schemaValidator(schema, body)).not.toThrow();
  });

  it('should throw an error when there are more than 6 properties', () => {
    const badBody = {
      ...body,
      additionalProp: 'tree',
    };
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"\\",\\"schemaPath\\":\\"#/maxProperties\\",\\"keyword\\":\\"maxProperties\\",\\"params\\":{\\"limit\\":6},\\"message\\":\\"must NOT have more than 6 properties\\"}]"`
    );
  });

  it('should throw an error when address line one is invalid', () => {
    const badBody = {
      ...body,
      addressLineOne: '±',
    };
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/addressLineOne\\",\\"schemaPath\\":\\"#/properties/addressLineOne/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z0-9 _.-]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z0-9 _.-]+$\\\\\\"\\"}]"`
    );
  });

  it('should throw an error when address line two is invalid', () => {
    const badBody = {
      ...body,
      addressLineTwo: '±',
    };
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/addressLineTwo\\",\\"schemaPath\\":\\"#/properties/addressLineTwo/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z0-9 _.-]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z0-9 _.-]+$\\\\\\"\\"}]"`
    );
  });

  it('should throw an error when address line three is invalid', () => {
    const badBody = {
      ...body,
      addressLineThree: '±',
    };
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/addressLineThree\\",\\"schemaPath\\":\\"#/properties/addressLineThree/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z0-9 _.-]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z0-9 _.-]+$\\\\\\"\\"}]"`
    );
  });

  it('should throw an error when address line four is invalid', () => {
    const badBody = {
      ...body,
      addressLineFour: '±',
    };
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/addressLineFour\\",\\"schemaPath\\":\\"#/properties/addressLineFour/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z0-9 _.-]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z0-9 _.-]+$\\\\\\"\\"}]"`
    );
  });

  it('should throw an error when address line five is invalid', () => {
    const badBody = {
      ...body,
      addressLineFive: '±',
    };
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/addressLineFive\\",\\"schemaPath\\":\\"#/properties/addressLineFive/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z0-9 _.-]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z0-9 _.-]+$\\\\\\"\\"}]"`
    );
  });

  it('should throw an error when postcode is invalid', () => {
    const badBody = {
      ...body,
      postCode: '±',
    };
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/postCode\\",\\"schemaPath\\":\\"#/properties/postCode/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z0-9 _.-]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z0-9 _.-]+$\\\\\\"\\"}]"`
    );
  });
});
