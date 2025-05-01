import { Channel, Connection, ConsumeMessage } from 'amqplib';

import { EventConstructor, EventConsumer, EventLogger, getEventKey } from '@bobo/event-client';

import { isRoutingKeyMatched } from './utils';

export type RoutingKeyEvent = { event: EventConstructor; routingKey: string };

export type EventBinding = { exchange: string; events: (EventConstructor | RoutingKeyEvent)[] };

export type AmqpEventConsumerConfig = Readonly<{
  queue: string;
  eventBindings?: EventBinding[];
}>;

export class AmqpEventConsumer extends EventConsumer {
  protected isConnected: boolean = false;

  protected channel!: Channel;

  protected events: (EventConstructor | RoutingKeyEvent)[] = [];

  constructor(
    public connection: Connection,
    protected readonly config: AmqpEventConsumerConfig,
    logger: EventLogger,
  ) {
    super(logger);
  }

  public override async init(): Promise<void> {
    this.channel = await this.connection.createChannel();

    this.channel.on('close', () => {
      this.isConnected = false;
      this.logger.warn(`(${this.constructor.name}) channel closed`);
    });

    await this.channel.checkQueue(this.config.queue);

    if (this.config.eventBindings) {
      this.events = this.config.eventBindings.flatMap((binding) => binding.events);

      await Promise.all(
        this.config.eventBindings.map((binding) => this.bindEventsWithExchange(binding)),
      );
    }
  }

  public override async consume(): Promise<void> {
    await this.channel.consume(this.config.queue, this.consumeMessage.bind(this), { noAck: false });
  }

  public override async close(): Promise<void> {
    await this.channel.close();
  }

  public async reconnect(connection: Connection): Promise<void> {
    if (this.isConnected) {
      await this.channel.close();
      this.isConnected = false;
    }

    this.connection = connection;

    await this.init();
    await this.consume();

    this.logger.info(
      `(${this.constructor.name}) "${this.config.queue}" consume channel reconnected`,
    );
  }

  protected consumeMessage(msg: ConsumeMessage | null): void {
    if (!msg) {
      return;
    }

    try {
      this.notify(this.getEventKeyByRoutingKey(msg.fields.routingKey), msg.content.toString());

      this.channel.ack(msg);
    } catch (error) {
      this.distributor.emitError(error);
    }
  }

  protected async bindEventsWithExchange(binding: EventBinding): Promise<void> {
    await this.channel.checkExchange(binding.exchange);

    await Promise.all(
      binding.events.map((event) =>
        this.channel.bindQueue(
          this.config.queue,
          binding.exchange,
          'routingKey' in event ? event.routingKey : getEventKey(event),
        ),
      ),
    );
  }

  protected getEventKeyByRoutingKey(routingKey: string): string {
    if (!this.config.eventBindings) {
      return routingKey;
    }

    const eventWithRoutingKey = this.events.find(
      (event) => 'routingKey' in event && isRoutingKeyMatched(event.routingKey, routingKey),
    ) as RoutingKeyEvent | undefined;

    return eventWithRoutingKey?.routingKey ? getEventKey(eventWithRoutingKey.event) : routingKey;
  }
}
