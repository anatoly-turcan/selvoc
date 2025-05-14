import { ObjectType } from '@nestjs/graphql';

import { UserPropsBaseGqlDto } from './user.props.base.dto';

@ObjectType()
export class UserPropsObjectGqlDto extends UserPropsBaseGqlDto {}
