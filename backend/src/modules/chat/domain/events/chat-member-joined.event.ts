import { IsNotEmpty, IsString } from 'class-validator';

import { Event } from '@common/event-client';

import { ChatMember } from '../entities';

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

  public static fromMember(member: ChatMember): ChatMemberJoinedEvent {
    return new ChatMemberJoinedEvent(member.chatId, member.userId);
  }
}
