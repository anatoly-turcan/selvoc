import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

import { SendChatMessageParams } from '../../../../application/services';

@InputType()
export class SendChatMessageInput implements SendChatMessageParams {
  @IsString()
  @IsNotEmpty()
  @Field()
  public chatId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  public content: string;
}
