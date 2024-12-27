import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

import { SendChatMessageParams } from '@modules/chat/application/services';

@InputType('SendChatMessageQuery')
export class SendChatMessageQueryGqlDto implements SendChatMessageParams {
  @IsString()
  @IsNotEmpty()
  @Field()
  public chatId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  public content: string;
}
