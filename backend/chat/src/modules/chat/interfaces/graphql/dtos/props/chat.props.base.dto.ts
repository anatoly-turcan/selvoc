import { Field, ObjectType } from '@nestjs/graphql';

import { ChatPropsDto } from '../../../common/dtos/props';

/**
 * Base DTO for Chat entity properties in a GraphQL context.
 * Retains validation decorators from the parent class while adding GraphQL-specific decorators.
 */
@ObjectType()
export class ChatPropsBaseGqlDto extends ChatPropsDto {
  @Field()
  declare public id: string;

  @Field()
  declare public name: string;
}
