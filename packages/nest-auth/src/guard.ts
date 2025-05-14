import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IAuthModuleOptions, AuthGuard as PassportAuthGuard } from '@nestjs/passport';

import { REQUEST_TOKEN_CLAIMS_KEY } from './constants';
import { IS_PUBLIC_KEY } from './decorators';
import { getRequestFromContext } from './utils';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  public override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  public override getRequest(context: ExecutionContext): unknown {
    return getRequestFromContext(context);
  }

  public getAuthenticateOptions(): IAuthModuleOptions | undefined {
    return { property: REQUEST_TOKEN_CLAIMS_KEY };
  }
}
