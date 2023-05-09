import { publishEvent } from '@adapters/secondary/event-adapter';
describe('event-adapter', () => {
  it('should successfully send the event and return void', async () => {
    // arrange
    const event = {
      id: '111',
    };

    // act & assert
    await expect(
      publishEvent(event, 'detailType', 'source', 'version', 'date-time')
    ).resolves.toBeUndefined();
  });

  it('should throw an error if no properties on the body of the event', async () => {
    // arrange
    const event = {}; // blank object

    // act & assert
    await expect(
      publishEvent(event, 'detailType', 'source', 'version', 'date-time')
    ).rejects.toMatchInlineSnapshot(
      `[NoEventBodyError: There is no body on the event]`
    );
  });
});
