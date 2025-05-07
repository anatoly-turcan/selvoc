import { Public } from '@bobo/nest-auth';
import { Query, Resolver } from '@nestjs/graphql';

import { VersionResponse } from '../dtos/responses';

@Resolver(VersionResponse)
export class CoreResolver {
  constructor() {}

  @Public()
  @Query(() => VersionResponse)
  public async version(): Promise<VersionResponse> {
    return new VersionResponse();
  }
}
