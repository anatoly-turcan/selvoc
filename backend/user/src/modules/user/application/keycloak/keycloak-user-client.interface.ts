export type KeycloakUser = {
  id: string;
  username: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  [key: string]: unknown;
};

export interface KeycloakUserClient {
  findById(id: string): Promise<KeycloakUser | null>;
}
