import { Inject, Injectable } from '@nestjs/common';

import { Timestamps } from '@common/domain';
import { EventInterceptor, EventListener } from '@common/event-client';
import {
  UserCreatedAdminKeycloakEvent,
  UserRegisteredKeycloakEvent,
  UserUpdatedAdminKeycloakEvent,
} from '@common/events';

import { KEYCLOAK_USER_CLIENT_TOKEN, User, USER_REPOSITORY_TOKEN } from '../../domain';
import { IKeycloakUserClient } from '../keycloak';
import { IUserRepository } from '../repositories';

@Injectable()
@EventInterceptor()
export class UserSyncApplicationService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly repository: IUserRepository,
    @Inject(KEYCLOAK_USER_CLIENT_TOKEN) private readonly keycloakUserClient: IKeycloakUserClient,
  ) {}

  public async sync(userId: string): Promise<void> {
    const keycloakUser = await this.keycloakUserClient.findById(userId);
    if (!keycloakUser) {
      console.log('Missing keycloak user');

      return;
    }

    const existingUser = await this.repository.findById(userId);

    await this.repository.save(
      new User({
        ...existingUser,
        ...keycloakUser,
        keycloakData: keycloakUser,
        timestamps: existingUser?.timestamps.updated() ?? Timestamps.now(),
      }),
    );
  }

  @EventListener(UserCreatedAdminKeycloakEvent)
  @EventListener(UserRegisteredKeycloakEvent)
  @EventListener(UserUpdatedAdminKeycloakEvent)
  public async handleUserEvent(
    event:
      | UserCreatedAdminKeycloakEvent
      | UserRegisteredKeycloakEvent
      | UserUpdatedAdminKeycloakEvent,
  ): Promise<void> {
    await this.sync(event.userId);
  }
}
