import { EventLogger } from './logger.interface';

export abstract class EventProducer {
  constructor(protected readonly logger: EventLogger) {}

  public abstract init(): Promise<void>;

  public abstract produce(event: unknown): Promise<void>;

  public abstract close(): Promise<void>;
}
