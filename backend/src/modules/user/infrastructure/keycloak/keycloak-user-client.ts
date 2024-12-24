import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { IKeycloakUserClient, KeycloakUser } from '@modules/user/application/keycloak';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KeycloakUserClient implements IKeycloakUserClient {
  constructor(private readonly keycloakClient: KeycloakAdminClient) {}

  public async findById(id: string): Promise<KeycloakUser | null> {
    return ((await this.keycloakClient.users.findOne({ id })) as KeycloakUser) ?? null;
  }
}
