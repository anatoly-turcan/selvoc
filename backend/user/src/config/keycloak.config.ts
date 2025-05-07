import { get } from 'env-var';

export type KeycloakConfig = {
  baseUrl: string;
  realm: string;
  clientId: string;
  clientSecret: string;
};

export const keycloakConfig: KeycloakConfig = {
  baseUrl: get('KEYCLOAK_BASE_URL').required().asString(),
  realm: get('KEYCLOAK_REALM').default('bobo').asString(),
  clientId: get('KEYCLOAK_CLIENT_ID').default('user-service').asString(),
  clientSecret: get('KEYCLOAK_CLIENT_SECRET').required().asString(),
};
