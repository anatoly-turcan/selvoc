import { ObjectType, PickType } from '@nestjs/graphql';

import { Chat } from '../../../../domain/entities';
import { GqlProps } from '../props';

@ObjectType('Chat')
export class ChatResponseGqlDto extends PickType(GqlProps.Chat.Object, ['id', 'name']) {
  constructor(chat: Chat) {
    super();

    this.id = chat.id;
    this.name = chat.name;
  }
}
