import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

import { APP_NAME, APP_VERSION } from '../../../common/constants';

@ObjectType('Version')
@Directive('@key(fields: "id")')
export class VersionResponse {
  @Field(() => ID)
  public id: string = 'singleton';

  @Field(() => String, { name: APP_NAME, description: APP_VERSION })
  public version: string = APP_VERSION;
}
