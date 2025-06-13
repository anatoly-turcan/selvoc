import { plainToInstance } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';

import { getEventConstructor, getEventKey } from './decorators';
import { EventDistributor } from './event-distributor';
import { EventTransport } from './event-transport';
import { EventValidationException } from './exception';
import { EventLogger } from './logger.interface';
import { EventConstructor } from './types';
import { stringifyPossibleError } from './utils';

export type ValidationParams = { options: ValidatorOptions };

export type EventClientParams = {
  transports: EventTransport[];
  logger: EventLogger;
  validation?: ValidationParams;
};

export class EventClient {
  protected readonly distributor = EventDistributor.getInstance();

  protected readonly transports: EventTransport[];

  protected readonly logger: EventLogger;

  protected readonly validation?: ValidationParams;

  constructor(protected readonly params: EventClientParams) {
    this.transports = params.transports;
    this.logger = params.logger;
    this.validation = params.validation;

    this.distributor.on('error', (error: unknown) =>
      this.logger.error(stringifyPossibleError(error)),
    );
  }

  public async init(): Promise<void> {
    await this.executeOnTransports(async (transport) => {
      transport.setLogger(this.logger);

      await transport.init();

      transport.subscribe((key, payload) => this.onRawEvent(key, payload, transport));

      this.logger.info(`${transport.constructor.name} transport initialized`);
    });
  }

  public async close(): Promise<void> {
    await this.executeOnTransports(async (transport) => {
      await transport.close();

      this.logger.info(`${transport.constructor.name} transport closed`);
    });
  }

  public async produce(event: object): Promise<void> {
    await this.validate(event);

    await this.executeOnTransports(async (transport) => {
      if (transport.canProduce(event.constructor as EventConstructor)) {
        this.logger.debug(
          `Producing '${getEventKey(event)}' event with ${transport.constructor.name} transport`,
        );

        await transport.produce(event);
      }
    });
  }

  protected async executeOnTransports(
    callback: (transport: EventTransport) => Promise<void> | void,
  ): Promise<void> {
    await Promise.all(this.transports.map(callback));
  }

  protected async validate(event: object): Promise<void> {
    const errors = await validate(event, {
      ...EventClient.DEFAULT_VALIDATION_OPTIONS,
      ...this.validation?.options,
    });

    if (errors.length) {
      throw new EventValidationException(getEventKey(event), errors);
    }
  }

  protected async onRawEvent(
    key: string,
    payload: string | object,
    transport: EventTransport,
  ): Promise<void> {
    try {
      const eventConstructor = getEventConstructor(key);
      if (!eventConstructor) {
        this.logger.debug(`Missing event constructor for '${key}'`);

        return;
      }

      const event = this.transform(eventConstructor, payload);

      await this.validate(event);

      this.logger.debug(`Distributing '${key}' event to the listeners`);

      this.distributor.distribute(event);
    } catch (error) {
      this.logger.error(
        `Failed to handle raw event '${key}' from ${transport.constructor.name} transport, reason: ${stringifyPossibleError(error)}`,
      );
    }
  }

  protected transform(eventConstructor: EventConstructor, payload: string | object): object {
    return plainToInstance(
      eventConstructor,
      typeof payload === 'string' ? JSON.parse(payload) : payload,
    ) as object;
  }

  public static readonly DEFAULT_VALIDATION_OPTIONS: ValidatorOptions = {
    whitelist: true,
    forbidNonWhitelisted: false,
    forbidUnknownValues: true,
  };
}
