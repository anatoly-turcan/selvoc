import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Module } from '@nestjs/common';

import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './module-definition';
import { KeycloakAdminClientModuleOptions } from './types';

@Module({
  providers: [
    {
      provide: KeycloakAdminClient,
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: async (
        options: KeycloakAdminClientModuleOptions,
      ): Promise<KeycloakAdminClient> => {
        const client = new KeycloakAdminClient(options.connection);

        await client.auth(options.credentials);

        return client;
      },
    },
  ],
  exports: [KeycloakAdminClient],
})
export class KeycloakAdminClientModule extends ConfigurableModuleClass {}
