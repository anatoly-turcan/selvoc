import { IsNotEmpty, IsString } from 'class-validator';

import { Event } from '@common/event-client';

import { ChatMembership } from '../entities';

@Event('chat.member.joined')
export class ChatMemberJoinedEvent {
  @IsString()
  @IsNotEmpty()
  public readonly chatId: string;

  @IsString()
  @IsNotEmpty()
  public readonly userId: string;

  constructor(chatId: string, userId: string) {
    this.chatId = chatId;
    this.userId = userId;
  }

  public static fromMembership(membership: ChatMembership): ChatMemberJoinedEvent {
    return new ChatMemberJoinedEvent(membership.chatId, membership.userId);
  }
}
