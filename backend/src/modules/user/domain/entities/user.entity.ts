import { BuildTimestampsParams, Timestamps } from '@common/domain';

export type UserKeycloakData = Record<string, unknown>;

export type BuildUserParams = {
  id: string;
  username: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  keycloakData: UserKeycloakData;
  timestamps: BuildTimestampsParams;
};

export class User {
  public id: string;

  public username: string;

  public email: string | null;

  public firstName: string | null;

  public lastName: string | null;

  public keycloakData: UserKeycloakData;

  public timestamps: Timestamps;

  constructor(params: BuildUserParams) {
    this.id = params.id;
    this.username = params.username;
    this.email = params.email;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.keycloakData = params.keycloakData;
    this.timestamps = new Timestamps(params.timestamps);
  }

  public update(
    data: Partial<BuildUserParams> & { timestamps?: Partial<BuildTimestampsParams> },
  ): this {
    this.id = data.id ?? this.id;
    this.username = data.username ?? this.username;
    this.email = data.email ?? this.email;
    this.firstName = data.firstName ?? this.firstName;
    this.lastName = data.lastName ?? this.lastName;
    this.keycloakData = data.keycloakData ?? this.keycloakData;

    if (data.timestamps) {
      this.timestamps.update(data.timestamps);
    } else {
      this.timestamps.updated();
    }

    return this;
  }
}
