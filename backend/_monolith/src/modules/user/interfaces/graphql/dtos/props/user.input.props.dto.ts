import { Field, InputType } from '@nestjs/graphql';

import { UserPropsDto } from '../../../common';

@InputType()
export class UserPropsInputGqlDto extends UserPropsDto {
  @Field()
  public override id: string;

  @Field()
  public override username: string;

  @Field(() => String)
  public override email: string | null;

  @Field(() => String)
  public override firstName: string | null;

  @Field(() => String)
  public override lastName: string | null;
}
