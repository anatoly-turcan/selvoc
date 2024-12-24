import { IsNotEmpty, IsString } from 'class-validator';

import { Event } from '@common/event-client';

import { getResourceIdFromResourcePath } from './utils';

@Event('kc.user.created')
export class UserCreatedAdminKeycloakEvent {
  @IsString()
  @IsNotEmpty()
  private readonly resourcePath: string;

  public get userId(): string {
    return getResourceIdFromResourcePath(this.resourcePath);
  }
}
