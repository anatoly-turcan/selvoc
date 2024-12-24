import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Module } from '@nestjs/common';

import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './module-definition';
import { NestKeycloakAdminClientModuleOptions } from './types';

@Module({
  providers: [
    {
      provide: KeycloakAdminClient,
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: async (options: NestKeycloakAdminClientModuleOptions) => {
        const client = new KeycloakAdminClient(options.connection);

        await client.auth(options.credentials);

        return client;
      },
    },
  ],
  exports: [KeycloakAdminClient],
})
export class NestKeycloakAdminClientModule extends ConfigurableModuleClass {}
