import { KeycloakAdminClientModule } from '@bobo/nest-keycloak-admin-client';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfig } from '@config';

import { KEYCLOAK_USER_CLIENT_TOKEN, USER_REPOSITORY_TOKEN } from './application/constants';
import { UserService, UserSyncService } from './application/services';
import { KeycloakUserClient } from './infrastructure/keycloak';
import { UserTypeormEntity, UserTypeormRepository } from './infrastructure/persistence';
import { FullUserResolver, UserResolver } from './interfaces/graphql';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypeormEntity]),
    KeycloakAdminClientModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const { baseUrl, realm, clientId, clientSecret } = configService.get('keycloak', {
          infer: true,
        });

        return {
          connection: { baseUrl, realmName: realm },
          credentials: { clientId, clientSecret, grantType: 'client_credentials' },
        };
      },
    }),
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
