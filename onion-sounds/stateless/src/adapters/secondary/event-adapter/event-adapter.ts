import * as AWS from 'aws-sdk';

import { PutEventsRequestEntry } from 'aws-sdk/clients/eventbridge';
import { config } from '@config/config';
import { logger } from '@packages/logger';

class NoEventBodyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoEventBodyError';
  }
}

const eventBridge = new AWS.EventBridge();

// this is a secondary adapter which will publish the event to eventbridge
// primary adapter --> use case --> (secondary adapter)
export async function publishEvent(
  event: Record<string, any>,
  detailType: string,
  source: string,
  eventVersion: string,
  eventDateTime: string
): Promise<void> {
  const eventBus = config.get('eventBus');

  if (Object.keys(event).length === 0) {
    throw new NoEventBodyError('There is no body on the event');
  }

  const createEvent: PutEventsRequestEntry = {
    Detail: JSON.stringify({
      metadata: {
        eventDateTime: eventDateTime,
        eventVersion: eventVersion,
      },
      data: {
        ...event,
      },
    }),
    DetailType: detailType,
    EventBusName: eventBus,
    Source: source,
  };

  const subscriptionEvent: AWS.EventBridge.PutEventsRequest = {
    Entries: [createEvent],
  };

  await eventBridge.putEvents(subscriptionEvent).promise();

  logger.info(
    `event ${detailType} published for ${event.id} to bus ${eventBus} with source ${source}`
  );
}
