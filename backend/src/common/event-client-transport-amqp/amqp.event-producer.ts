import { ConfirmChannel, Connection } from 'amqplib';

import { EventLogger, EventProducer, getEventKey } from '@common/event-client';

export type AmqpEventProducerConfig = Readonly<{
  exchange: string;
  reconnectionTimeoutMs?: number;
}>;

export class AmqpEventProducer extends EventProducer {
  protected isConnected: boolean = false;

  protected channel!: ConfirmChannel;

  protected reconnectionPromise: Promise<void> | undefined;

  protected resolveReconnectionPromise: (() => void) | undefined;

  constructor(
    public connection: Connection,
    protected readonly config: AmqpEventProducerConfig,
    logger: EventLogger,
  ) {
    super(logger);
  }

  public override async init(): Promise<void> {
    this.channel = await this.connection.createConfirmChannel();

    this.channel.on('close', () => {
      this.isConnected = false;
      this.logger.warn(`(${this.constructor.name}) channel closed`);

      this.reconnectionPromise = new Promise((resolve, reject) => {
        this.resolveReconnectionPromise = resolve;

        setTimeout(
          () => reject(new Error('Producer channel reconnection timeout')),
          this.config.reconnectionTimeoutMs ?? AmqpEventProducer.DEFAULT_RECONNECTION_TIMEOUT_MS,
        );
      });
    });

    await this.channel.checkExchange(this.config.exchange);

    this.isConnected = true;
    this.reconnectionPromise = undefined;
    this.resolveReconnectionPromise = undefined;
  }

  public override async produce(event: object): Promise<void> {
    if (!this.isConnected) {
      await this.reconnectionPromise;
    }

    let resolvePublish: (value?: void) => void;
    let rejectPublish: (reason?: any) => void;

    const promise = new Promise<void>((resolve, reject) => {
      resolvePublish = resolve;
      rejectPublish = reject;
    });

    const isChannelBufferFull = !this.channel.publish(
      this.config.exchange,
      getEventKey(event),
      Buffer.from(JSON.stringify(event)),
      undefined,
      (error) => {
        if (error) {
          rejectPublish(error);
        } else {
          resolvePublish();
        }
      },
    );

    if (isChannelBufferFull) {
      await new Promise((resolve) => {
        this.channel.once('drain', resolve);
      });
    }

    await promise;
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

    this.logger.info('Publish channel reconnected');
  }

  public static readonly DEFAULT_RECONNECTION_TIMEOUT_MS = 5 * 60 * 1000;
}
