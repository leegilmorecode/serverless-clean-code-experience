import { schema } from './create-customer-playlist.schema';
import { schemaValidator } from '@packages/schema-validator';

describe('create-playlist-schema', () => {
  it('should validate successfully a valid object', () => {
    // arrange
    const payload = {
      playlistName: 'valid',
    };
    // act / assert
    expect(() => schemaValidator(schema, payload)).not.toThrow();
  });

  it('should not validate if the playlistName is invalid', () => {
    // arrange
    const payload = {
      playlistName: '±', // invalid
    };
    // act / assert
    expect(() =>
schemaValidator(schema, payload)).
toThrowErrorMatchingInlineSnapshot(`"[{\\"instancePath\\":\\"/playlistName\\",\\"schemaPath\\":\\"#/properties/playlistName/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z]+$\\\\\\"\\"}]"`);
  });

  it('should not validate if the playlistName is null', () => {
    // arrange
    const payload = {
      playlistName: null, // invalid
    };
    // act / assert
    expect(() =>
      schemaValidator(schema, payload)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/playlistName\\",\\"schemaPath\\":\\"#/properties/playlistName/type\\",\\"keyword\\":\\"type\\",\\"params\\":{\\"type\\":\\"string\\"},\\"message\\":\\"must be string\\"}]"`
    );
  });
});
