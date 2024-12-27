import {
  EventConstructor,
  EventConsumer,
  EventConsumerListener,
  EventProducer,
  EventTransport,
  getEventKey,
} from '@common/event-client';

export class MemoryEventTransport extends EventTransport {
  protected override consumers: EventConsumer[] = [];

  protected override producers: EventProducer[] = [];

  protected override eventProducerMap: Map<EventConstructor, EventProducer> = new Map();

  protected events: Set<EventConstructor>;

  protected listener: EventConsumerListener;

  constructor(events: EventConstructor[]) {
    super();

    this.events = new Set(events);
  }

  public override canProduce(eventConstructor: EventConstructor): boolean {
    return this.events.has(eventConstructor);
  }

  public override subscribe(listener: EventConsumerListener): void {
    this.listener = listener;
  }

  public override async produce(event: object): Promise<void> {
    await this.listener(getEventKey(event), event);
  }
}
