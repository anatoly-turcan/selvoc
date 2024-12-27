export type EventConstructor = new (...args: any[]) => any;

export type EventHandler = (event: unknown) => unknown;
