import 'dotenv/config';
import { EventClientConfig, eventClientConfig } from './event-client.config';
import { keycloakConfig, KeycloakConfig } from './keycloak.config';

export type UserConfig = {
  keycloak: KeycloakConfig;
  eventClient: EventClientConfig;
};

export function loadUserConfig(): UserConfig {
  return {
    keycloak: keycloakConfig,
    eventClient: eventClientConfig,
  };
}
