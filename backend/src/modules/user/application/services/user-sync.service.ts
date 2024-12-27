import { Inject, Injectable } from '@nestjs/common';

import { Timestamps } from '@common/domain';
import { EventInterceptor, EventListener } from '@common/event-client';
import {
  UserCreatedAdminKeycloakEvent,
  UserRegisteredKeycloakEvent,
  UserUpdatedAdminKeycloakEvent,
} from '@common/events';

import { User } from '../../domain';
import { KEYCLOAK_USER_CLIENT_TOKEN, USER_REPOSITORY_TOKEN } from '../constants';
import { IKeycloakUserClient } from '../keycloak';
import { IUserRepository } from '../repositories';

@Injectable()
@EventInterceptor()
export class UserSyncService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly users: IUserRepository,
    @Inject(KEYCLOAK_USER_CLIENT_TOKEN)
    private readonly keycloakUserClient: IKeycloakUserClient,
  ) {}

  public async sync(userId: string): Promise<void> {
    const keycloakUser = await this.keycloakUserClient.findById(userId);
    if (!keycloakUser) {
      console.log('Missing keycloak user');

      return;
    }

    const existingUser = await this.users.findOne({ where: { id: userId } });

    await this.users.save(
      new User({
        ...existingUser,
        ...keycloakUser,
        keycloakData: keycloakUser,
        timestamps: existingUser?.timestamps.updated() ?? Timestamps.now(),
      }),
    );
  }

  @EventListener(
    UserCreatedAdminKeycloakEvent,
    UserRegisteredKeycloakEvent,
    UserUpdatedAdminKeycloakEvent,
  )
  public async handleUserEvent(
    event:
      | UserCreatedAdminKeycloakEvent
      | UserRegisteredKeycloakEvent
      | UserUpdatedAdminKeycloakEvent,
  ): Promise<void> {
    await this.sync(event.userId);
  }
}
