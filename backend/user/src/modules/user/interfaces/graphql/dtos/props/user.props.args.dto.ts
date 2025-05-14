import { ArgsType } from '@nestjs/graphql';

import { UserPropsBaseGqlDto } from './user.props.base.dto';

@ArgsType()
export class UserPropsArgsGqlDto extends UserPropsBaseGqlDto {}
