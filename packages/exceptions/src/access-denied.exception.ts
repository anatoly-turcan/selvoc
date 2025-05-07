import { AppException } from './app.exception';

export class AccessDeniedException extends AppException {
  constructor() {
    super('Access denied');
  }
}
