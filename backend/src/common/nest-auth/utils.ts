import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export function getRequestFromContext(ctx: ExecutionContext): any {
  const contextType = ctx.getType<'http' | 'graphql'>();

  if (contextType === 'http') {
    return ctx.switchToHttp().getRequest();
  }

  if (contextType === 'graphql') {
    return GqlExecutionContext.create(ctx).getContext().req;
  }

  throw new Error(`Unsupported context type: ${contextType}`);
}
