import { IsDate, IsNotEmpty, IsString } from 'class-validator';

import { Event } from '@common/event-client';
import { PropertiesOf } from '@common/utils';

import { ChatMessage } from '../entities';

@Event('chat.message.created')
export class ChatMessageCreatedEvent {
  @IsString()
  @IsNotEmpty()
  public messageId: string;

  @IsString()
  @IsNotEmpty()
  public chatId: string;

  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsDate()
  public createdAt: Date;

  public static build(data: PropertiesOf<ChatMessageCreatedEvent>): ChatMessageCreatedEvent {
    const event = new ChatMessageCreatedEvent();

    event.messageId = data.messageId;
    event.chatId = data.chatId;
    event.userId = data.userId;
    event.content = data.content;
    event.createdAt = data.createdAt;

    return event;
  }

  public static fromMessage(message: ChatMessage): ChatMessageCreatedEvent {
    return this.build({
      ...message,
      messageId: message.id,
    });
  }
}
