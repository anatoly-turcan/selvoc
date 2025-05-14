import { InputType } from '@nestjs/graphql';

import { UserPropsBaseGqlDto } from './user.props.base.dto';

@InputType()
export class UserPropsInputGqlDto extends UserPropsBaseGqlDto {}
