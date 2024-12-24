import { IsNotEmpty, IsString } from 'class-validator';

import { Event } from '@common/event-client';

@Event('kc.user.registered')
export class UserRegisteredKeycloakEvent {
  @IsString()
  @IsNotEmpty()
  public readonly userId: string;
}
