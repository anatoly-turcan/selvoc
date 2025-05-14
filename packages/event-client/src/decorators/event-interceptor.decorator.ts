import 'reflect-metadata';

import { EventDistributor } from '../event-distributor';
import { EventConstructor, EventHandler } from '../types';

const EVENT_INTERCEPTOR_HANDLERS_METADATA = Symbol('EVENT_INTERCEPTOR_HANDLERS_METADATA');

export type EventInterceptorHandlerDefinition = {
  propertyKey: string | symbol;
  eventConstructor: EventConstructor;
};

export type EventInterceptorHandlers = EventInterceptorHandlerDefinition[] | undefined;

export type EventInterceptorConstructor = new (...args: any[]) => any;

const getEventInterceptorHandlers = (
  constructor: EventInterceptorConstructor,
): EventInterceptorHandlers =>
  Reflect.getMetadata(EVENT_INTERCEPTOR_HANDLERS_METADATA, constructor);

export const addEventInterceptorHandler = (
  definition: EventInterceptorHandlerDefinition,
  target: object,
): void => {
  const interceptorHandlers =
    getEventInterceptorHandlers(target.constructor as EventInterceptorConstructor) ?? [];

  interceptorHandlers.push(definition);

  Reflect.defineMetadata(
    EVENT_INTERCEPTOR_HANDLERS_METADATA,
    interceptorHandlers,
    target.constructor,
  );
};

export const EventInterceptor = (): ClassDecorator => (constructor) =>
  class extends (constructor as unknown as EventInterceptorConstructor) {
    constructor(...args: any[]) {
      super(...args);

      const interceptorHandlers = getEventInterceptorHandlers(
        constructor as unknown as EventInterceptorConstructor,
      );
      if (!interceptorHandlers) {
        return;
      }

      const eventDistributor = EventDistributor.getInstance();

      interceptorHandlers.forEach(({ propertyKey, eventConstructor }) => {
        const eventHandler = (this[propertyKey as string] as EventHandler).bind(this);

        eventDistributor.register(eventConstructor, eventHandler);
      });
    }
  } as unknown as typeof constructor;
