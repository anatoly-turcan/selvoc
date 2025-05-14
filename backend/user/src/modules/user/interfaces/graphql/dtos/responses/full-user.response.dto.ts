import { IntersectionType, ObjectType, PartialType, PickType } from '@nestjs/graphql';

import { User } from '../../../../domain/entities';
import { GqlProps } from '../props';

import { UserResponseGqlDto } from './user.response.dto';

@ObjectType('FullUser')
export class FullUserResponseGqlDto extends IntersectionType(
  UserResponseGqlDto,
  PartialType(PickType(GqlProps.User.Object, ['email'])),
) {
  constructor(user: User) {
    super();

    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
