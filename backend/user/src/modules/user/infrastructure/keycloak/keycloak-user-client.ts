import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';

import { KeycloakUserClient, KeycloakUser } from '../../application/keycloak';

@Injectable()
export class KeycloakUserClientImpl implements KeycloakUserClient {
  constructor(private readonly keycloakClient: KeycloakAdminClient) {}

  public async findById(id: string): Promise<KeycloakUser | null> {
    const user = await this.keycloakClient.users.findOne({ id });

    return (user as KeycloakUser) ?? null;
  }
}
