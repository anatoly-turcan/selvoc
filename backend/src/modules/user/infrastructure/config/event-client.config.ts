import { EventClientParams } from '@common/event-client';
import { AmqpEventTransport } from '@common/event-client-transport-amqp';

import { amqpConfig } from './amqp.config';

export type EventClientConfig = Omit<EventClientParams, 'logger'>;

export const eventClientConfig: EventClientConfig = {
  transports: [new AmqpEventTransport(amqpConfig)],
};
