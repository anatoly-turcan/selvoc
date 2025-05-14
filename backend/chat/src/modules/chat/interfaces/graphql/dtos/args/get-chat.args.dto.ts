import { ArgsType, PickType } from '@nestjs/graphql';

import { GqlProps } from '../props';

@ArgsType()
export class GetChatArgs extends PickType(GqlProps.Chat.Args, ['id']) {}
