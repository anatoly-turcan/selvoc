import { Field, ObjectType } from '@nestjs/graphql';

import { UserPropsDto } from '../../../common/dtos/props';

/**
 * Base DTO for User entity properties in a GraphQL context.
 * Retains validation decorators from the parent class while adding GraphQL-specific decorators.
 */
@ObjectType()
export class UserPropsBaseGqlDto extends UserPropsDto {
  @Field()
  public override id: string;

  @Field()
  public override username: string;

  @Field(() => String, { nullable: true })
  public override email: string | null;

  @Field(() => String, { nullable: true })
  public override firstName: string | null;

  @Field(() => String, { nullable: true })
  public override lastName: string | null;
}
