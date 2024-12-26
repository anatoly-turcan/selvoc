import { IsNotEmpty, IsString } from 'class-validator';

import { Event } from '@common/event-client';

import { Chat } from '../entities';

// probably no need
@Event('chat.created')
export class ChatCreatedEvent {
  @IsString()
  @IsNotEmpty()
  public readonly chatId: string;

  constructor(chatId: string) {
    this.chatId = chatId;
  }

  public static fromChat(chat: Chat): ChatCreatedEvent {
    return new ChatCreatedEvent(chat.id);
  }
}
