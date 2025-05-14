import { Event } from '@bobo/event-client';
import { IsNotEmpty, IsString } from 'class-validator';

import { ChatMembership } from '../entities';

@Event('chat.member.joined')
export class ChatMemberJoinedEvent {
  @IsString()
  @IsNotEmpty()
  public chatId: string;

  @IsString()
  @IsNotEmpty()
  public userId: string;

  public static build(chatId: string, userId: string): ChatMemberJoinedEvent {
    const event = new ChatMemberJoinedEvent();

    event.chatId = chatId;
    event.userId = userId;

    return event;
  }

  public static fromMembership(membership: ChatMembership): ChatMemberJoinedEvent {
    return this.build(membership.chatId, membership.userId);
  }
}
