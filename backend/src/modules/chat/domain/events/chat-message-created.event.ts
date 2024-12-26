import { IsDate, IsNotEmpty, IsString } from 'class-validator';

import { Event } from '@common/event-client';

import { ChatMessage } from '../entities';

@Event('chat.message.created')
export class ChatMessageCreatedEvent {
  @IsString()
  @IsNotEmpty()
  public readonly chatId: string;

  @IsString()
  @IsNotEmpty()
  public readonly userId: string;

  @IsString()
  @IsNotEmpty()
  public readonly content: string;

  @IsDate()
  public readonly createdAt: Date;

  constructor(chatId: string, userId: string, content: string, createdAt: Date) {
    this.chatId = chatId;
    this.userId = userId;
    this.content = content;
    this.createdAt = createdAt;
  }

  public static fromMessage(message: ChatMessage): ChatMessageCreatedEvent {
    return new ChatMessageCreatedEvent(
      message.chatId,
      message.userId,
      message.content,
      message.createdAt,
    );
  }
}
