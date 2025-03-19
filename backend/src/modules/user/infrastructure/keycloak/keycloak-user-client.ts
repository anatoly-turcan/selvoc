import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';

import { IKeycloakUserClient, KeycloakUser } from '@modules/user/application/keycloak';

@Injectable()
export class KeycloakUserClient implements IKeycloakUserClient {
  constructor(private readonly keycloakClient: KeycloakAdminClient) {}

  public async findById(id: string): Promise<KeycloakUser | null> {
    return ((await this.keycloakClient.users.findOne({ id })) as KeycloakUser) ?? null;
  }
}
