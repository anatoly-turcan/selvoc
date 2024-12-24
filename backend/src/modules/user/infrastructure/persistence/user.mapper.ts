import { User } from '@modules/user/domain';

import { UserTypeormEntity } from './user.typeorm-entity';

export class UserMapper {
  private constructor() {}

  public static toDomain(typeormEntity: UserTypeormEntity): User {
    const { createdAt, updatedAt, ...commonUserProps } = typeormEntity;

    return new User({ ...commonUserProps, timestamps: { createdAt, updatedAt } });
  }

  public static toPersistence(entity: User): UserTypeormEntity {
    const { timestamps, ...commonUserProps } = entity;

    return new UserTypeormEntity({ ...commonUserProps, ...timestamps });
  }
}
