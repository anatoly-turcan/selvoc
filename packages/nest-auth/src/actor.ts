import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { REQUEST_TOKEN_CLAIMS_KEY } from './constants';
import { getRequestFromContext } from './utils';

export type RequestActor = {
  id: string;
};

export function getRequestActorFromRequest(req: any): RequestActor | undefined {
  const claims = req[REQUEST_TOKEN_CLAIMS_KEY];
  if (!claims?.sub) {
    return undefined;
  }

  return {
    id: claims.sub,
  };
}

export function getRequestActorFromGqlContext(
  ctx: Record<string, unknown>,
): RequestActor | undefined {
  return getRequestActorFromRequest(ctx.req);
}

export const Actor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestActor | undefined =>
    getRequestActorFromRequest(getRequestFromContext(ctx)),
);
