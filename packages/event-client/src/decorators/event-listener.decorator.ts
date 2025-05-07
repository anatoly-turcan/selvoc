import { EventConstructor } from '../types';

import { addEventInterceptorHandler } from './event-interceptor.decorator';

export const EventListener =
  (...eventConstructors: EventConstructor[]): MethodDecorator =>
  (target, propertyKey) => {
    eventConstructors.map((eventConstructor) =>
      addEventInterceptorHandler({ eventConstructor, propertyKey }, target),
    );
  };
