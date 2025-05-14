import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

import { InviteChatMemberParams } from '../../../../application/services';

@InputType()
export class InviteChatMemberInput implements InviteChatMemberParams {
  @IsString()
  @IsNotEmpty()
  @Field()
  public chatId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  public userId: string;
}
