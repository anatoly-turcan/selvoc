export type EventConstructor = new (...args: unknown[]) => unknown;

export type EventHandler = (event: unknown) => unknown;
