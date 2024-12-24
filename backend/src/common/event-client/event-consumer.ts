import EventEmitter from 'events';

import { EventDistributor } from './event-distributor';
import { EventLogger } from './logger.interface';

const NOTIFICATION_KEY = 'event';

export type EventConsumerListener = (key: string, payload: string) => unknown;

export abstract class EventConsumer {
  protected readonly distributor = EventDistributor.getInstance();

  protected readonly emitter = new EventEmitter();

  constructor(protected readonly logger: EventLogger) {}

  public abstract init(): Promise<void>;

  public abstract consume(): Promise<void>;

  public abstract close(): Promise<void>;

  public subscribe(listener: EventConsumerListener): void {
    this.emitter.on(NOTIFICATION_KEY, listener);
  }

  protected notify(key: string, payload: string): void {
    this.emitter.emit(NOTIFICATION_KEY, key, payload);
  }
}
