import { Query, Resolver } from '@nestjs/graphql';

import { Actor, RequestActor } from '@common/nest-auth';
import { UserService } from '@modules/user/application/services';

import { FullUserResponseGqlDto } from '../dtos/responses';

@Resolver(() => FullUserResponseGqlDto)
export class FullUserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => FullUserResponseGqlDto, { name: 'me' })
  public async getMe(@Actor() actor: RequestActor): Promise<FullUserResponseGqlDto> {
    const user = await this.userService.getById(actor.id);

    return new FullUserResponseGqlDto(user);
  }
}
