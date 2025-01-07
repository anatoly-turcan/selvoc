import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonConfig } from '@common/infrastructure/config/common.config';
import { KeycloakAdminClientModule } from '@common/nest-keycloak-admin-client';

import { KEYCLOAK_USER_CLIENT_TOKEN, USER_REPOSITORY_TOKEN } from './application/constants';
import { UserService, UserSyncService } from './application/services';
import { KeycloakUserClient } from './infrastructure/keycloak';
import { UserTypeormEntity, UserTypeormRepository } from './infrastructure/persistence';
import { FullUserResolver, UserResolver } from './interfaces/graphql';

@Module({
  imports: [
    ConfigModule,
    KeycloakAdminClientModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<CommonConfig, true>) => {
        const { baseUrl, realm, clientId, clientSecret } = configService.get('keycloak', {
          infer: true,
        });

        return {
          connection: { baseUrl, realmName: realm },
          credentials: { clientId, clientSecret, grantType: 'client_credentials' },
        };
      },
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
