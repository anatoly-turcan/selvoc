import { IntersectionType, ObjectType, PickType } from '@nestjs/graphql';

import { User } from '@modules/user/domain';

import { PartialUserFullNamePropsGqlDto } from '../props/partial-user-full-name.object.props.dto';
import { UserPropsObjectGqlDto } from '../props/user.object.props.dto';

@ObjectType('User')
export class UserResponseGqlDto extends IntersectionType(
  PickType(UserPropsObjectGqlDto, ['id', 'username']),
  PartialUserFullNamePropsGqlDto,
) {
  constructor(user: User) {
    super();

    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
