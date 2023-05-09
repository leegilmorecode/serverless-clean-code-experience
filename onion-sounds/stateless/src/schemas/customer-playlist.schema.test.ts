import { CustomerPlaylistDto } from '@dto/customer-playlist';
import { schema } from './customer-playlist.schema';
import { schemaValidator } from '../../../packages/schema-validator';

let body: CustomerPlaylistDto = {
  id: 'f39e49ad-8f88-448f-8a15-41d560ad6d70',
  created: '2022-01-01T00:00:00.000Z',
  updated: '2022-01-01T00:00:00.000Z',
  playlistName: 'testplaylist',
  songIds: [],
};

describe('customer-playlist-schema', () => {
  it('should validate correctly with the correct payload', () => {
    expect(() => schemaValidator(schema, body)).not.toThrow();
  });

  it('should throw an error when there are more than 5 properties', () => {
    const badBody = {
      ...body,
      additionalProp: 'tree',
    };
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"\\",\\"schemaPath\\":\\"#/maxProperties\\",\\"keyword\\":\\"maxProperties\\",\\"params\\":{\\"limit\\":5},\\"message\\":\\"must NOT have more than 5 properties\\"}]"`
    );
  });

  it('should throw an error when there are less than 5 properties', () => {
    const badBody = {};
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"\\",\\"schemaPath\\":\\"#/minProperties\\",\\"keyword\\":\\"minProperties\\",\\"params\\":{\\"limit\\":5},\\"message\\":\\"must NOT have fewer than 5 properties\\"},{\\"instancePath\\":\\"\\",\\"schemaPath\\":\\"#/required\\",\\"keyword\\":\\"required\\",\\"params\\":{\\"missingProperty\\":\\"id\\"},\\"message\\":\\"must have required property 'id'\\"},{\\"instancePath\\":\\"\\",\\"schemaPath\\":\\"#/required\\",\\"keyword\\":\\"required\\",\\"params\\":{\\"missingProperty\\":\\"created\\"},\\"message\\":\\"must have required property 'created'\\"},{\\"instancePath\\":\\"\\",\\"schemaPath\\":\\"#/required\\",\\"keyword\\":\\"required\\",\\"params\\":{\\"missingProperty\\":\\"updated\\"},\\"message\\":\\"must have required property 'updated'\\"},{\\"instancePath\\":\\"\\",\\"schemaPath\\":\\"#/required\\",\\"keyword\\":\\"required\\",\\"params\\":{\\"missingProperty\\":\\"playlistName\\"},\\"message\\":\\"must have required property 'playlistName'\\"},{\\"instancePath\\":\\"\\",\\"schemaPath\\":\\"#/required\\",\\"keyword\\":\\"required\\",\\"params\\":{\\"missingProperty\\":\\"songIds\\"},\\"message\\":\\"must have required property 'songIds'\\"}]"`
    );
  });

  it('should throw an error if id is not valid', () => {
    const badBody = {
      ...body,
      id: 111, // not a string
    };
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/id\\",\\"schemaPath\\":\\"#/properties/id/type\\",\\"keyword\\":\\"type\\",\\"params\\":{\\"type\\":\\"string\\"},\\"message\\":\\"must be string\\"}]"`
    );
  });

  it('should throw an error if playlistName is not valid', () => {
    const badBody = {
      ...body,
      playlistName: '!@$%*', // not valid
    };
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/playlistName\\",\\"schemaPath\\":\\"#/properties/playlistName/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z]+$\\\\\\"\\"}]"`
    );
  });

  it('should throw an error if songIds is not valid', () => {
    const badBody = {
      ...body,
      songIds: [1, 2, 3], // not valid
    };
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/songIds/0\\",\\"schemaPath\\":\\"#/properties/songIds/items/type\\",\\"keyword\\":\\"type\\",\\"params\\":{\\"type\\":\\"string\\"},\\"message\\":\\"must be string\\"},{\\"instancePath\\":\\"/songIds/1\\",\\"schemaPath\\":\\"#/properties/songIds/items/type\\",\\"keyword\\":\\"type\\",\\"params\\":{\\"type\\":\\"string\\"},\\"message\\":\\"must be string\\"},{\\"instancePath\\":\\"/songIds/2\\",\\"schemaPath\\":\\"#/properties/songIds/items/type\\",\\"keyword\\":\\"type\\",\\"params\\":{\\"type\\":\\"string\\"},\\"message\\":\\"must be string\\"}]"`
    );
  });

  it('should throw an error if created is not valid', () => {
    const badBody = {
      ...body,
      created: 111, // not a string
    };
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/created\\",\\"schemaPath\\":\\"#/properties/created/type\\",\\"keyword\\":\\"type\\",\\"params\\":{\\"type\\":\\"string\\"},\\"message\\":\\"must be string\\"}]"`
    );
  });

  it('should throw an error if updated is not valid', () => {
    const badBody = {
      ...body,
      updated: 111, // not a string
    };
    expect(() =>
      schemaValidator(schema, badBody)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/updated\\",\\"schemaPath\\":\\"#/properties/updated/type\\",\\"keyword\\":\\"type\\",\\"params\\":{\\"type\\":\\"string\\"},\\"message\\":\\"must be string\\"}]"`
    );
  });
});
