import { ConnectionConfig } from '@keycloak/keycloak-admin-client/lib/client';
import { Credentials } from '@keycloak/keycloak-admin-client/lib/utils/auth';

export type NestKeycloakAdminClientModuleOptions = {
  connection: ConnectionConfig;
  credentials: Credentials;
};
