import { EventConsumerListener } from './event-consumer';
import { EventLogger } from './logger.interface';
import { EventConstructor } from './types';

export abstract class EventTransport {
  protected logger!: EventLogger;

  public abstract init(): Promise<void> | void;

  public abstract close(): Promise<void> | void;

  public abstract produce(event: object): Promise<void> | void;

  public abstract subscribe(listener: EventConsumerListener): void;

  public abstract canProduce(eventConstructor: EventConstructor): boolean;

  public setLogger(logger: EventLogger): void {
    this.logger = logger;
  }
}
