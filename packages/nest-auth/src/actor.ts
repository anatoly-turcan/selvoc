import { REQUEST_TOKEN_CLAIMS_KEY } from './constants';

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
