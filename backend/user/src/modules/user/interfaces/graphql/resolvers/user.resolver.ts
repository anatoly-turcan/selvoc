import { Args, Query, Resolver } from '@nestjs/graphql';

import { UserService } from '../../../application/services';
import { FindUserArgs } from '../dtos/args';
import { UserResponseGqlDto } from '../dtos/responses';

@Resolver(() => UserResponseGqlDto)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResponseGqlDto, { name: 'user', nullable: true })
  public async findUser(@Args() query: FindUserArgs): Promise<UserResponseGqlDto | null> {
    const user = await this.userService.findByUsername(query.username);

    return user && new UserResponseGqlDto(user);
  }
}
