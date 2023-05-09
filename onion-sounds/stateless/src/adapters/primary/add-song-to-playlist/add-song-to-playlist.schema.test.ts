import { schema } from './add-song-to-playlist.schema';
import { schemaValidator } from '@packages/schema-validator';

describe('add-song-to-playlist-schema', () => {
  it('should validate successfully a valid object', () => {
    // arrange
    const payload = {
      songId: 'valid',
    };
    // act / assert
    expect(() => schemaValidator(schema, payload)).not.toThrow();
  });

  it('should not validate if the songId is invalid', () => {
    // arrange
    const payload = {
      songId: '±', // invalid
    };
    // act / assert
    expect(() =>
      schemaValidator(schema, payload)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/songId\\",\\"schemaPath\\":\\"#/properties/songId/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^[a-zA-Z]+$\\"},\\"message\\":\\"must match pattern \\\\\\"^[a-zA-Z]+$\\\\\\"\\"}]"`
    );
  });

  it('should not validate if the songId is null', () => {
    // arrange
    const payload = {
      songId: null, // invalid
    };
    // act / assert
    expect(() =>
      schemaValidator(schema, payload)
    ).toThrowErrorMatchingInlineSnapshot(
      `"[{\\"instancePath\\":\\"/songId\\",\\"schemaPath\\":\\"#/properties/songId/type\\",\\"keyword\\":\\"type\\",\\"params\\":{\\"type\\":\\"string\\"},\\"message\\":\\"must be string\\"}]"`
    );
  });
});
