import { ObjectType, PartialType, PickType } from '@nestjs/graphql';

import { UserPropsObjectGqlDto } from './user.object.props.dto';

@ObjectType()
export class PartialUserFullNamePropsGqlDto extends PartialType(
  PickType(UserPropsObjectGqlDto, ['firstName', 'lastName']),
) {}
