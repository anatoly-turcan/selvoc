import { InputType } from '@nestjs/graphql';

import { ChatPropsBaseGqlDto } from './chat.props.base.dto';

@InputType()
export class ChatPropsInputGqlDto extends ChatPropsBaseGqlDto {}
