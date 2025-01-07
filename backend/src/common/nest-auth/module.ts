import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { KeycloakJwksStrategy } from './keycloak-jwks.strategy';
import { ConfigurableModuleClass } from './module-definition';

@Global()
@Module({
  imports: [PassportModule],
  providers: [KeycloakJwksStrategy],
})
export class AuthModule extends ConfigurableModuleClass {}
