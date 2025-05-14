import { Field, ObjectType } from '@nestjs/graphql';

import { UserPropsDto } from '../../../common/dtos/props';

/**
 * Base DTO for User entity properties in a GraphQL context.
 * Retains validation decorators from the parent class while adding GraphQL-specific decorators.
 */
@ObjectType()
export class UserPropsBaseGqlDto extends UserPropsDto {
  @Field()
  declare public id: string;

  @Field()
  declare public username: string;

  @Field(() => String, { nullable: true })
  declare public email: string | null;

  @Field(() => String, { nullable: true })
  declare public firstName: string | null;

  @Field(() => String, { nullable: true })
  declare public lastName: string | null;
}
