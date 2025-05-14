import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequestFromContext } from '../utils';
import { getRequestActorFromRequest, RequestActor } from '../actor';

export const Actor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestActor | undefined =>
    getRequestActorFromRequest(getRequestFromContext(ctx)),
);
