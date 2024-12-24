import { EventEmitter } from 'events';

import { getEventKey } from './decorators';
import { EventConstructor, EventHandler } from './types';

export class EventDistributor extends EventEmitter {
  private static instance: EventDistributor;

  private constructor() {
    super();
  }

  public register(eventConstructor: EventConstructor, eventHandler: EventHandler): void {
    this.on(getEventKey(eventConstructor), (event: unknown) => {
      try {
        const result: unknown = eventHandler(event);

        if (result instanceof Promise) {
          result.catch((reason) => this.emitError(reason, event));
        }
      } catch (error) {
        this.emitError(error, event);
      }
    });
  }

  public emitError(error: unknown, event?: unknown): void {
    this.emit(
      'error',
      error instanceof Error ? error : new Error(`Unknown error, cause: ${JSON.stringify(error)}`),
      event,
    );
  }

  public distribute(event: object): void {
    this.emit(getEventKey(event), event);
  }

  public static getInstance(): EventDistributor {
    this.instance ??= new EventDistributor();

    return this.instance;
  }
}
