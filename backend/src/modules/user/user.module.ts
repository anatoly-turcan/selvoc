import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { NestEventClientModule } from '@common/nest-event-client';
import { NestKeycloakAdminClientModule } from '@common/nest-keycloak-admin-client';

import { loadUserConfig, UserConfig } from './infrastructure/config/user.config';
import { TestService } from './test.service';

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
  ],
  providers: [TestService],
})
export class UserModule {}
