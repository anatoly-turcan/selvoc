import { ArgsType } from '@nestjs/graphql';

import { ChatPropsBaseGqlDto } from './chat.props.base.dto';

@ArgsType()
export class ChatPropsArgsGqlDto extends ChatPropsBaseGqlDto {}
