import { IntersectionType, ObjectType, PartialType, PickType } from '@nestjs/graphql';

import { User } from '../../../../domain/entities';
import { GqlProps } from '../props';

@ObjectType('User')
export class UserResponseGqlDto extends IntersectionType(
  PickType(GqlProps.User.Object, ['id', 'username']),
  PartialType(PickType(GqlProps.User.Object, ['firstName', 'lastName'])),
) {
  constructor(user: User) {
    super();

    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
