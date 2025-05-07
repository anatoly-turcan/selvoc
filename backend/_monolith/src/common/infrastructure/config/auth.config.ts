import { AuthModuleOptions } from '@common/nest-auth';

import { keycloakConfig } from './keycloak.config';

export type AuthConfig = AuthModuleOptions;

export const authConfig = keycloakConfig;
