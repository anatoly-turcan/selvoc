import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

import { PropertiesOf } from '@common/utils';
import { ChatMessageCreatedEvent } from '@modules/chat/domain/events';

@ObjectType('ChatMessageCreatedEvent')
export class ChatMessageCreatedGqlEvent {
  @IsString()
  @IsNotEmpty()
  @Field()
  public readonly chatId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  public readonly userId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  public readonly content: string;

  @IsDate()
  @Field()
  public readonly createdAt: Date;

  public static readonly SUBSCRIPTION_NAME = 'onChatMessageCreated';

  constructor(params: PropertiesOf<ChatMessageCreatedGqlEvent>) {
    this.chatId = params.chatId;
    this.userId = params.userId;
    this.content = params.content;
    this.createdAt = params.createdAt;
  }

  public static fromDomain(event: ChatMessageCreatedEvent): ChatMessageCreatedGqlEvent {
    return new ChatMessageCreatedGqlEvent(event);
  }
}
