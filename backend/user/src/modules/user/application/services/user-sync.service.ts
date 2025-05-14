import { Inject, Injectable } from '@nestjs/common';
import { EventInterceptor, EventListener } from '@selvoc/event-client';
import {
  UserCreatedAdminKeycloakEvent,
  UserRegisteredKeycloakEvent,
  UserUpdatedAdminKeycloakEvent,
} from '@selvoc/events';
import { PinoLogger } from '@selvoc/nest-logger-pino';

import { User } from '../../domain/entities';
import { KEYCLOAK_USER_CLIENT_TOKEN, USER_REPOSITORY_TOKEN } from '../constants';
import { IKeycloakUserClient } from '../keycloak';
import { IUserRepository } from '../repositories';

@Injectable()
@EventInterceptor()
export class UserSyncService {
  private readonly logger: PinoLogger;

  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly users: IUserRepository,
    @Inject(KEYCLOAK_USER_CLIENT_TOKEN)
    private readonly keycloakUserClient: IKeycloakUserClient,
    loggerService: PinoLogger,
  ) {
    this.logger = loggerService.child(UserSyncService.name);
  }

  public async sync(userId: string): Promise<void> {
    const keycloakUser = await this.keycloakUserClient.findById(userId);
    if (!keycloakUser) {
      this.logger.warn('Missing keycloak user', { userId });

      return;
    }

    const existingUser = await this.users.findOne({ where: { id: userId } });

    await this.users.save(
      new User({
        ...existingUser,
        ...keycloakUser,
        keycloakData: keycloakUser,
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
