import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestEventClientModule } from '@common/nest-event-client';
import { NestKeycloakAdminClientModule } from '@common/nest-keycloak-admin-client';

import { KEYCLOAK_USER_CLIENT_TOKEN, USER_REPOSITORY_TOKEN } from './application/constants';
import { UserService, UserSyncService } from './application/services';
import { loadUserConfig, UserConfig } from './infrastructure/config/user.config';
import { KeycloakUserClient } from './infrastructure/keycloak';
import { UserTypeormEntity, UserTypeormRepository } from './infrastructure/persistence';
import { FullUserResolver, UserResolver } from './interfaces/graphql';

@Module({
  imports: [
    ConfigModule.forFeature(loadUserConfig),
    NestKeycloakAdminClientModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<UserConfig, true>) => {
        const { baseUrl, realm, clientId, clientSecret } = configService.get('keycloak', {
          infer: true,
        });

        return {
          connection: { baseUrl, realmName: realm },
          credentials: { clientId, clientSecret, grantType: 'client_credentials' },
        };
      },
    }),
    NestEventClientModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<UserConfig, true>) => ({
        ...configService.get('eventClient', { infer: true }),
        logger: console,
      }),
    }),
    TypeOrmModule.forFeature([UserTypeormEntity]),
  ],
  providers: [
    { provide: KEYCLOAK_USER_CLIENT_TOKEN, useClass: KeycloakUserClient },
    { provide: USER_REPOSITORY_TOKEN, useClass: UserTypeormRepository },
    UserSyncService,
    UserService,
    UserResolver,
    FullUserResolver,
  ],
})
export class UserModule {}
