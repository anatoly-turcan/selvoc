import { ExecutionContext, Injectable } from '@nestjs/common';
import { IAuthModuleOptions, AuthGuard as PassportAuthGuard } from '@nestjs/passport';

import { REQUEST_TOKEN_CLAIMS_KEY } from './constants';
import { getRequestFromContext } from './utils';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  public override getRequest(context: ExecutionContext): unknown {
    return getRequestFromContext(context);
  }

  public getAuthenticateOptions(): IAuthModuleOptions | undefined {
    return { property: REQUEST_TOKEN_CLAIMS_KEY };
  }
}
