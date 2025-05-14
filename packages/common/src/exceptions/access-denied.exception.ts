import { AppException } from './app.exception';

export class AccessDeniedException extends AppException {
  constructor(message: string = 'Access denied') {
    super(message);
  }
}
