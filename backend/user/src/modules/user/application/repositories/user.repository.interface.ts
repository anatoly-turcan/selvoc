import { NonNullableObject } from '@selvoc/common';

import { User } from '../../domain/entities';

export type UserFilterParams = NonNullableObject<Partial<Omit<User, 'keycloakData' | 'update'>>>;

export type FindOneUserParams = { where: UserFilterParams };

export interface IUserRepository {
  findOne(params: FindOneUserParams): Promise<User | null>;
  save(user: User): Promise<User>;
}
