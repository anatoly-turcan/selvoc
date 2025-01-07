import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { getRequestFromContext } from './utils';

export type RequestActor = {
  id: string;
};

export const Actor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestActor | undefined => {
    const req = getRequestFromContext(ctx);
    if (!req.user?.sub) {
      return undefined;
    }

    return {
      id: req.user.sub,
    };
  },
);
