import { setTimeout } from 'timers/promises';

export const getExponentialBackoffDelay = (attempt: number, maxDelay: number): number => {
  const delay = 2 ** attempt * 1000;

  return Math.min(delay, maxDelay);
};

export async function retryWithExponentialBackoff<T>(
  action: () => T | Promise<T>,
  maxAttempts: number,
  maxDelay: number,
): Promise<T> {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await action();
    } catch (error) {
      lastError = error;

      if (attempt >= maxAttempts) {
        break;
      }

      // eslint-disable-next-line no-await-in-loop
      await setTimeout(getExponentialBackoffDelay(attempt, maxDelay));
    }
  }

  throw lastError;
}

export function routingKeyToRegex(routingKey: string): RegExp {
  const regexString = routingKey
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special regex characters
    .replace(/\*/g, '[^\\.]+') // Replace * with one word (non-dot, non-empty)
    .replace(/#/g, '.*'); // Replace # with zero or more words

  return new RegExp(`^${regexString}$`);
}

export function isRoutingKeyMatched(routingKeyBinding: string, routingKeyField: string): boolean {
  if (routingKeyBinding.includes('*') || routingKeyBinding.includes('#')) {
    return routingKeyToRegex(routingKeyBinding).test(routingKeyField);
  }

  return routingKeyBinding === routingKeyField;
}
