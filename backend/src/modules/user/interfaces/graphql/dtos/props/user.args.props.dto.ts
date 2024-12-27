import { ArgsType, Field } from '@nestjs/graphql';

import { UserPropsDto } from '../../../common';

@ArgsType()
export class UserPropsArgsGqlDto extends UserPropsDto {
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
