import { Connection, Options, connect } from 'amqplib';

import { CompositeEventTransport, EventConstructor } from '@common/event-client';

import { AmqpEventConsumer, AmqpEventConsumerConfig } from './amqp.event-consumer';
import { AmqpEventProducer, AmqpEventProducerConfig } from './amqp.event-producer';
import { retryWithExponentialBackoff } from './utils';

export type AmqpEventTransportProducerConfig = AmqpEventProducerConfig & {
  events: EventConstructor[];
};

export type ExchangeDefinition = Options.AssertExchange & {
  name: string;
  type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match';
};

export type QueueDefinition = Options.AssertQueue & {
  name: string;
};

export type Definitions = {
  exchanges?: ExchangeDefinition[];
  queues?: QueueDefinition[];
};

export type AmqpEventTransportConnectionConfig = {
  connection: string | Options.Connect;
  producers?: AmqpEventTransportProducerConfig[];
  consumers?: AmqpEventConsumerConfig[];
  definitions?: Definitions;
};

export type ReconnectionConfig = { attempts?: number; maxDelayMs?: number };

export type AmqpEventTransportConfig = {
  connections: AmqpEventTransportConnectionConfig[];
  reconnect?: ReconnectionConfig;
};

export class AmqpEventTransport extends CompositeEventTransport {
  protected override consumers: AmqpEventConsumer[] = [];

  protected override producers: AmqpEventProducer[] = [];

  protected override eventProducerMap: Map<EventConstructor, AmqpEventProducer> = new Map();

  protected readonly connections: Connection[] = [];

  constructor(protected readonly config: AmqpEventTransportConfig) {
    super();
  }

  public override async init(): Promise<void> {
    await this.configure();
    await super.init();
  }

  public override async close(): Promise<void> {
    await super.close();
    await this.closeConnections();
  }

  protected async configure(): Promise<void> {
    await Promise.all(
      this.config.connections.map(async (config) => {
        const connection = await connect(config.connection);
        this.connections.push(connection);

        this.configureConnection(connection, config);

        if (config.definitions) {
          await this.assertDefinitions(connection, config.definitions);
        }

        if (config.consumers) {
          this.configureConsumers(connection, config.consumers);
        }

        if (config.producers) {
          this.configureProducers(connection, config.producers);
        }
      }),
    );
  }

  protected async assertDefinitions(
    connection: Connection,
    definitions: Definitions,
  ): Promise<void> {
    const channel = await connection.createChannel();

    if (definitions.exchanges) {
      await Promise.all(
        definitions.exchanges.map(async ({ name, type, ...config }) => {
          await channel.assertExchange(name, type, config);
        }),
      );
    }

    if (definitions.queues) {
      await Promise.all(
        definitions.queues.map(async ({ name, ...config }) => {
          await channel.assertQueue(name, config);
        }),
      );
    }

    await channel.close();
  }

  protected async reconnect(
    oldConnection: Connection,
    config: AmqpEventTransportConnectionConfig,
  ): Promise<void> {
    this.logger.info(`(${this.constructor.name}) reconnecting...`);

    const { attempts, maxDelayMs } = {
      ...AmqpEventTransport.DEFAULT_RECONNECTION_CONFIG,
      ...this.config.reconnect,
    };

    const newConnection = await retryWithExponentialBackoff(
      () => connect(config.connection),
      attempts,
      maxDelayMs,
    );

    this.configureConnection(newConnection, config);
    this.replaceConnection(newConnection, oldConnection);

    const consumers = this.consumers.filter((consumer) => consumer.connection === oldConnection);
    const producers = this.producers.filter((producer) => producer.connection === oldConnection);

    await Promise.all([
      ...consumers.map((consumer) => consumer.reconnect(newConnection)),
      ...producers.map((producer) => producer.reconnect(newConnection)),
    ]);

    this.logger.info(`(${this.constructor.name}) reconnected`);
  }

  protected async closeConnections(): Promise<void> {
    await Promise.all(this.connections.map((connection) => connection.close()));
  }

  protected configureConsumers(
    connection: Connection,
    consumerConfigs: AmqpEventConsumerConfig[],
  ): void {
    const consumers = consumerConfigs.map(
      (config) => new AmqpEventConsumer(connection, config, this.logger),
    );

    this.consumers.push(...consumers);
  }

  protected configureProducers(
    connection: Connection,
    producerConfigs: AmqpEventTransportProducerConfig[],
  ): void {
    const producers = producerConfigs.map((config) => {
      const producer = new AmqpEventProducer(connection, config, this.logger);

      config.events.forEach((event) => this.setEventProducer(event, producer));

      return producer;
    });

    this.producers.push(...producers);
  }

  protected configureConnection(
    connection: Connection,
    config: AmqpEventTransportConnectionConfig,
  ): void {
    connection.on('close', (error?: Error) => {
      this.logger.warn(`(${this.constructor.name}) connection closed: ${error?.message}`);

      this.reconnect(connection, config);
    });
  }

  protected setEventProducer(
    eventConstructor: EventConstructor,
    producer: AmqpEventProducer,
  ): void {
    this.eventProducerMap.set(eventConstructor, producer);
  }

  private replaceConnection(newConnection: Connection, oldConnection: Connection): void {
    const oldConnectionIndex = this.connections.indexOf(oldConnection);
    this.connections[oldConnectionIndex] = newConnection;
  }

  public static readonly DEFAULT_RECONNECTION_CONFIG: Required<ReconnectionConfig> = {
    attempts: 5,
    maxDelayMs: 30000,
  };
}
