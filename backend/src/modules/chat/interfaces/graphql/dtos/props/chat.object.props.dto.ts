import { Field, ObjectType } from '@nestjs/graphql';

import { ChatPropsDto } from '@modules/chat/interfaces/common';

@ObjectType()
export class ChatPropsObjectGqlDto extends ChatPropsDto {
  @Field()
  public id: string;

  @Field()
  public name: string;
}
