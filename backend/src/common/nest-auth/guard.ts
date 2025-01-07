import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

import { getRequestFromContext } from './utils';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  public override getRequest(context: ExecutionContext): unknown {
    return getRequestFromContext(context);
  }
}
