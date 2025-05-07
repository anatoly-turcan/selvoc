import { ArgsType, PickType } from '@nestjs/graphql';

import { ChatPropsArgsGqlDto } from '../props';

@ArgsType()
export class GetChatGqlQueryDto extends PickType(ChatPropsArgsGqlDto, ['id']) {}
