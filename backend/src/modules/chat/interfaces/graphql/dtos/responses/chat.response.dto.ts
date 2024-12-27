import { ObjectType, PickType } from '@nestjs/graphql';

import { Chat } from '@modules/chat/domain/entities';

import { ChatPropsObjectGqlDto } from '../props';

@ObjectType('Chat')
export class ChatResponseGqlDto extends PickType(ChatPropsObjectGqlDto, ['id', 'name']) {
  constructor(chat: Chat) {
    super();

    this.id = chat.id;
    this.name = chat.name;
  }
}
