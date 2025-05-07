import { Field, ObjectType } from '@nestjs/graphql';

import { APP_NAME, APP_VERSION } from '../../../common/constants';

@ObjectType()
export class VersionResponse {
  @Field(() => String, { name: APP_NAME, description: APP_VERSION })
  public version: string = APP_VERSION;
}
