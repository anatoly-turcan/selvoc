import { AppException } from './app.exception';

export class InternalServerErrorException extends AppException {
  constructor(message: string = 'Internal server error') {
    super(message);
  }
}
