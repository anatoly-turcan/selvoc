import 'reflect-metadata';

import { EventConstructor } from '../types';

const constructorMap = new Map<string, EventConstructor>();

const EVENT_KEY_METADATA = Symbol('EVENT_KEY_METADATA');

export const Event =
  (key: string): ClassDecorator =>
  (constructor) => {
    if (!key.length) {
      throw new Error(`"${constructor.name}" event key should not be empty`);
    }

    const existingConstructor = constructorMap.get(key);
    if (existingConstructor) {
      throw new Error(`Key "${key}" is already used by "${existingConstructor.name}" event`);
    }

    if (Reflect.hasMetadata(EVENT_KEY_METADATA, constructor)) {
      throw new Error(`"${constructor.name}" is already decorated with another key`);
    }

    constructorMap.set(key, constructor as unknown as EventConstructor);

    Reflect.defineMetadata(EVENT_KEY_METADATA, key, constructor);
  };

export const getEventConstructor = (key: string): EventConstructor | undefined =>
  constructorMap.get(key) ?? undefined;

export const getEventKey = (constructorOrEvent: EventConstructor | object): string => {
  const constructor =
    typeof constructorOrEvent === 'function' ? constructorOrEvent : constructorOrEvent.constructor;

  const eventKey = Reflect.getMetadata(EVENT_KEY_METADATA, constructor) as string | undefined;
  if (!eventKey) {
    throw new Error('Missing event key');
  }

  return eventKey;
};
