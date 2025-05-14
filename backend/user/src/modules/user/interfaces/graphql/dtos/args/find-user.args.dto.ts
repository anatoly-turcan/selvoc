import { ArgsType, PickType } from '@nestjs/graphql';

import { GqlProps } from '../props';

@ArgsType()
export class FindUserArgs extends PickType(GqlProps.User.Args, ['username']) {}
