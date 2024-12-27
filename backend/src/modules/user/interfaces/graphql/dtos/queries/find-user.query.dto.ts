import { ArgsType, PickType } from '@nestjs/graphql';

import { UserPropsArgsGqlDto } from '../props/user.args.props.dto';

@ArgsType()
export class FindUserGqlQueryDto extends PickType(UserPropsArgsGqlDto, ['username']) {}
