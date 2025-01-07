import { IsNotEmpty, IsString } from 'class-validator';

import { Event } from '@common/event-client';

import { Chat } from '../entities';

// probably no need
@Event('chat.created')
export class ChatCreatedEvent {
  @IsString()
  @IsNotEmpty()
  public chatId: string;

  public static build(chatId: string): ChatCreatedEvent {
    const event = new ChatCreatedEvent();

    event.chatId = chatId;

    return event;
  }

  public static fromChat(chat: Chat): ChatCreatedEvent {
    return this.build(chat.id);
  }
}
