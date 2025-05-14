import {
  EventConstructor,
  EventConsumerListener,
  EventTransport,
  getEventKey,
} from '@selvoc/event-client';

export class BasicEventTransport extends EventTransport {
  protected events: Set<EventConstructor>;

  protected listener?: EventConsumerListener;

  constructor(events: EventConstructor[]) {
    super();

    this.events = new Set(events);
  }

  public override init(): void {}

  public override close(): void {}

  public override async produce(event: object): Promise<void> {
    if (!this.listener) {
      throw new Error('No listener registered');
    }

    await this.listener(getEventKey(event), event);
  }

  public override subscribe(listener: EventConsumerListener): void {
    this.listener = listener;
  }

  public override canProduce(eventConstructor: EventConstructor): boolean {
    return this.events.has(eventConstructor);
  }
}
