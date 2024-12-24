import { EventConstructor } from '../types';

import { addEventInterceptorHandler } from './event-interceptor.decorator';

export const EventListener =
  (eventConstructor: EventConstructor): MethodDecorator =>
  (target, propertyKey) =>
    addEventInterceptorHandler({ eventConstructor, propertyKey }, target);
