import { IntersectionType, ObjectType, PartialType, PickType } from '@nestjs/graphql';

import { User } from '@modules/user/domain';

import { UserPropsObjectGqlDto } from '../props/user.object.props.dto';

import { UserResponseGqlDto } from './user.response.dto';

@ObjectType('FullUser')
export class FullUserResponseGqlDto extends IntersectionType(
  UserResponseGqlDto,
  PartialType(PickType(UserPropsObjectGqlDto, ['email'])),
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
