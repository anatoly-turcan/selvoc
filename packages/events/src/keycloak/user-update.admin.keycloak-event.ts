import { IsString, IsNotEmpty } from 'class-validator';

import { Event } from '@selvoc/event-client';

import { getResourceIdFromResourcePath } from './utils';

@Event('kc.user.updated')
export class UserUpdatedAdminKeycloakEvent {
  @IsString()
  @IsNotEmpty()
  private readonly resourcePath!: string;

  public get userId(): string {
    return getResourceIdFromResourcePath(this.resourcePath);
  }

  public static getRouteKey(realm: string = '*'): string {
    return `KK.EVENT.ADMIN.${realm}.SUCCESS.USER.UPDATE`;
  }
}
