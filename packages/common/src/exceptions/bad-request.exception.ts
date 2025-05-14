import { AppException } from './app.exception';

export class BadRequestException extends AppException {
  constructor(message: string = 'Bad request') {
    super(message);
  }
}
