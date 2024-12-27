import { NonNullableObject } from '@common/utils';

import { User } from '../../domain/entities';

export type UserFilterParams = NonNullableObject<
  Partial<Omit<User, 'keycloakData' | 'timestamps' | 'update'>>
>;

export type FindOneUserParams = { where: UserFilterParams };

export interface IUserRepository {
  findOne(params: FindOneUserParams): Promise<User | null>;
  save(user: User): Promise<User>;
}
