import { ArgsType, Field } from '@nestjs/graphql';

import { ChatPropsDto } from '@modules/chat/interfaces/common';

@ArgsType()
export class ChatPropsArgsGqlDto extends ChatPropsDto {
  @Field()
  public id: string;

  @Field()
  public name: string;
}
