import { ObjectType } from '@nestjs/graphql';

import { ChatPropsBaseGqlDto } from './chat.props.base.dto';

@ObjectType()
export class ChatPropsObjectGqlDto extends ChatPropsBaseGqlDto {}
