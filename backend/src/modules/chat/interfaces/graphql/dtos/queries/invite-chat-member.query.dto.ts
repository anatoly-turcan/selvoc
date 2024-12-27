import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

import { InviteChatMemberParams } from '@modules/chat/application/services';

@InputType()
export class InviteChatMemberQueryGqlDto implements InviteChatMemberParams {
  @IsString()
  @IsNotEmpty()
  @Field()
  public chatId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  public userId: string;
}
