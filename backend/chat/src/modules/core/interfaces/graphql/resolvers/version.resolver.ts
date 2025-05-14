import { ResolveField, Resolver } from '@nestjs/graphql';

import { APP_NAME, APP_VERSION } from '../../common';
import { VersionResponse } from '../dtos/responses';

@Resolver(VersionResponse)
export class VersionResolver {
  @ResolveField(() => String, { name: APP_NAME })
  public version(): string {
    return APP_VERSION;
  }
}
