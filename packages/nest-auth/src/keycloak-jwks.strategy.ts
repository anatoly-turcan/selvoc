import { Inject, Injectable } from '@nestjs/common';

import { JwksStrategy } from '../jwks.strategy';
import { MODULE_OPTIONS_TOKEN } from '../module-definition';

export type KeycloakJwksStrategyOptions = {
  baseUrl: string;
  realm: string;
};

@Injectable()
export class KeycloakJwksStrategy extends JwksStrategy {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: KeycloakJwksStrategyOptions) {
    super({
      jwks: {
        jwksUri: KeycloakJwksStrategy.buildUri(options),
      },
    });
  }

  private static buildUri(options: KeycloakJwksStrategyOptions): string {
    return `${options.baseUrl}/realms/${options.realm}/protocol/openid-connect/certs`;
  }
}
