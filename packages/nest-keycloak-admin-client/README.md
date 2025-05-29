# Nest Keycloak Admin Client

This package provides a wrapper around the Keycloak Admin Client for use with
NestJS.

## Installation

`@keycloak/keycloak-admin-client` is a peer dependency, so you need to install
it separately.

```bash
npm install @selvoc/nest-keycloak-admin-client @keycloak/keycloak-admin-client
```

## Usage

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KeycloakAdminClientModule } from '@selvoc/nest-keycloak-admin-client';

@Module({
  imports: [
    ConfigModule,
    KeycloakAdminClientModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { baseUrl, realm, clientId, clientSecret } = configService.get('keycloak', { infer: true });

        return {
          connection: { baseUrl, realmName: realm },
          credentials: { clientId, clientSecret, grantType: 'client_credentials' },
        };
      },
    }),
  ],
  ...
})

// service.ts
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Service {
  constructor(private readonly keycloakClient: KeycloakAdminClient) {}

  // ...
}
```
