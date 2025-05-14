import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Version')
@Directive('@extends')
@Directive('@key(fields: "id")')
export class VersionResponse {
  @Field(() => ID)
  @Directive('@external')
  public id: string = 'singleton';
}
