import { AppException } from './app.exception';

export class NotFoundException extends AppException {
  constructor(message: string = 'Not found') {
    super(message);
  }
}
