import { plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';

import { getEventConstructor, getEventKey } from './decorators';
import { EventDistributor } from './event-distributor';
import { EventTransport } from './event-transport';
import { EventValidationException } from './exception';
import { EventLogger } from './logger.interface';
import { EventConstructor } from './types';

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

    this.distributor.on('error', (error: unknown) => this.logger.error(JSON.stringify(error)));
  }

  public async init(): Promise<void> {
    await this.executeOnTransports(async (transport) => {
      transport.setLogger(this.logger);

      await transport.init();

      transport.subscribe((key, payload) =>
        this.onRawEvent(key, payload).catch((reason) =>
          this.logger.error(
            `Failed to handle raw event (${key}), reason: ${JSON.stringify(reason)}`,
          ),
        ),
      );
    });
  }

  public async close(): Promise<void> {
    await this.executeOnTransports((transport) => transport.close());
  }

  public async produce(event: object): Promise<void> {
    await this.validate(event);

    await this.executeOnTransports((transport) =>
      transport.canProduce(event.constructor as EventConstructor)
        ? transport.produce(event)
        : undefined,
    );
  }

  protected async executeOnTransports(
    callback: (transport: EventTransport) => Promise<void> | undefined,
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

  protected async onRawEvent(key: string, payload: string | object): Promise<void> {
    const eventConstructor = getEventConstructor(key);
    if (!eventConstructor) {
      this.logger.debug(`Missing event constructor for "${key}"`);

      return;
    }

    const event = this.transform(eventConstructor, payload);

    await this.validate(event);

    this.distributor.distribute(event);
  }

  protected transform(eventConstructor: EventConstructor, payload: string | object): object {
    return plainToClass(
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
