import { Args, Query, Resolver } from '@nestjs/graphql';

import { UserService } from '@modules/user/application/services';

import { FindUserGqlQueryDto } from '../dtos/queries';
import { UserResponseGqlDto } from '../dtos/responses';

@Resolver(() => UserResponseGqlDto)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResponseGqlDto, { name: 'user', nullable: true })
  public async findUser(@Args() query: FindUserGqlQueryDto): Promise<UserResponseGqlDto | null> {
    const user = await this.userService.findByUsername(query.username);

    return user && new UserResponseGqlDto(user);
  }
}
