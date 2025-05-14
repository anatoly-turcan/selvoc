import { AuthModuleOptions } from '@bobo/nest-auth';

import { keycloakConfig } from './keycloak.config';

export type AuthConfig = AuthModuleOptions;

export const authConfig = keycloakConfig;
