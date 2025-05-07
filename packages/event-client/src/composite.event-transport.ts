import { getEventKey } from './decorators';
import { EventConsumer, EventConsumerListener } from './event-consumer';
import { EventProducer } from './event-producer';
import { EventTransport } from './event-transport';
import { EventConstructor } from './types';

export abstract class CompositeEventTransport extends EventTransport {
  protected abstract consumers: EventConsumer[];

  protected abstract producers: EventProducer[];

  protected abstract eventProducerMap: Map<EventConstructor, EventProducer>;

  public async init(): Promise<void> {
    await this.initConsumers();
    await this.initProducers();
  }

  public async close(): Promise<void> {
    await this.closeConsumers();
    await this.closeProducers();
  }

  public async produce(event: object): Promise<void> {
    const producer = this.eventProducerMap.get(event.constructor as EventConstructor);
    const eventKey = getEventKey(event);
    if (!producer) {
      throw new Error(`Producer not found for "${eventKey}"`);
    }

    await producer.produce(event);
  }

  public subscribe(listener: EventConsumerListener): void {
    this.consumers.forEach((consumer) => consumer.subscribe(listener));
  }

  public canProduce(eventConstructor: EventConstructor): boolean {
    return this.eventProducerMap.has(eventConstructor);
  }

  private async initConsumers(): Promise<void> {
    await Promise.all(
      this.consumers.map(async (consumer) => {
        await consumer.init();
        await consumer.consume();
      }),
    );
  }

  private async initProducers(): Promise<void> {
    await Promise.all(this.producers.map((producer) => producer.init()));
  }

  private async closeConsumers(): Promise<void> {
    await Promise.all(this.consumers.map((consumer) => consumer.close()));
  }

  private async closeProducers(): Promise<void> {
    await Promise.all(this.producers.map((producer) => producer.close()));
  }
}
