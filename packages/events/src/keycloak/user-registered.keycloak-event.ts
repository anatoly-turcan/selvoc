import { IsNotEmpty, IsString } from 'class-validator';

import { Event } from '@bobo/event-client';

@Event('kc.user.registered')
export class UserRegisteredKeycloakEvent {
  @IsString()
  @IsNotEmpty()
  public readonly userId!: string;

  public static getRouteKey(realm: string = '*'): string {
    return `KK.EVENT.CLIENT.${realm}.SUCCESS.*.REGISTER`;
  }
}
