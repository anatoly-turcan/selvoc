import { Field, InputType } from '@nestjs/graphql';

import { ChatPropsDto } from '@modules/chat/interfaces/common';

@InputType()
export class ChatPropsInputGqlDto extends ChatPropsDto {
  @Field()
  public id: string;

  @Field()
  public name: string;
}
