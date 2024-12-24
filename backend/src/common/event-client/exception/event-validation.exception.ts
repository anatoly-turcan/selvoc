import { ValidationError } from 'class-validator';

export class EventValidationException extends Error {
  constructor(
    public readonly eventKey: string,
    public readonly errors: ValidationError[],
  ) {
    const constraints = errors.map((e) => e.toString(false, true, '', true)).join('');

    super(`Validation failed. Event key: ${eventKey}. Constraints:\n${constraints}`);
  }
}
