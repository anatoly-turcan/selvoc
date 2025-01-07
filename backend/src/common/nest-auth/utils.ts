import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export function getRequestFromContext(ctx: ExecutionContext): any {
  const contextType = ctx.getType<'http' | 'graphql'>();

  if (contextType === 'http') {
    return ctx.switchToHttp().getRequest();
  }

  if (contextType === 'graphql') {
    const { req } = GqlExecutionContext.create(ctx).getContext();

    // NOTE: required for graphql subscription auth
    // TODO: find a better way?
    if (req.subscriptions && !req.headers && req.connectionParams?.Authorization) {
      req.headers = { authorization: req.connectionParams.Authorization };
    }

    return req;
  }

  throw new Error(`Unsupported context type: ${contextType}`);
}
