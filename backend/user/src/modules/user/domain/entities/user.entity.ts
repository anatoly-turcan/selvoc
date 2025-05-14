export type UserKeycloakData = Record<string, unknown>;

export type BuildUserParams = {
  id: string;
  username: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  keycloakData: UserKeycloakData;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User {
  public id: string;

  public username: string;

  public email: string | null;

  public firstName: string | null;

  public lastName: string | null;

  public keycloakData: UserKeycloakData;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(params: BuildUserParams) {
    const now = new Date();

    this.id = params.id;
    this.username = params.username;
    this.email = params.email;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.keycloakData = params.keycloakData;
    this.createdAt = params.createdAt ?? now;
    this.updatedAt = params.updatedAt ?? now;
  }

  public update(data: Partial<Omit<BuildUserParams, 'createdAt' | 'updatedAt'>>): this {
    this.id = data.id ?? this.id;
    this.username = data.username ?? this.username;
    this.email = data.email ?? this.email;
    this.firstName = data.firstName ?? this.firstName;
    this.lastName = data.lastName ?? this.lastName;
    this.keycloakData = data.keycloakData ?? this.keycloakData;
    this.updatedAt = new Date();

    return this;
  }
}
