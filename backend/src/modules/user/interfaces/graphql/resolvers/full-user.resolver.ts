import { Context, Query, Resolver } from '@nestjs/graphql';

import { UserService } from '@modules/user/application/services';

import { FullUserResponseGqlDto } from '../dtos/responses';

@Resolver(() => FullUserResponseGqlDto)
export class FullUserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => FullUserResponseGqlDto, { name: 'me' })
  public async getMe(@Context() ctx: any): Promise<FullUserResponseGqlDto> {
    console.log(ctx.req.headers);
    const user = await this.userService.getById('64c4e6fc-f286-4d41-aa7e-6155b908bfb4');

    return new FullUserResponseGqlDto(user);
  }
}
