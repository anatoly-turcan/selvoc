import { AppException } from './app.exception';

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}
