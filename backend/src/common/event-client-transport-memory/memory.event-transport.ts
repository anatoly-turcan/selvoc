import {
  EventConstructor,
  EventConsumerListener,
  EventTransport,
  getEventKey,
} from '@common/event-client';

export class MemoryEventTransport extends EventTransport {
  protected events: Set<EventConstructor>;

  protected listener: EventConsumerListener;

  constructor(events: EventConstructor[]) {
    super();

    this.events = new Set(events);
  }

  public override init(): void {}

  public override close(): void {}

  public override async produce(event: object): Promise<void> {
    await this.listener(getEventKey(event), event);
  }

  public override subscribe(listener: EventConsumerListener): void {
    this.listener = listener;
  }

  public override canProduce(eventConstructor: EventConstructor): boolean {
    return this.events.has(eventConstructor);
  }
}
