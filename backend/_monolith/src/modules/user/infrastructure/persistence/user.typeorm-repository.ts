import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FindOneUserParams, IUserRepository } from '@modules/user/application/repositories';
import { User } from '@modules/user/domain';

import { UserTypeormEntity } from './user.typeorm-entity';

@Injectable()
export class UserTypeormRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserTypeormEntity)
    private readonly users: Repository<UserTypeormEntity>,
  ) {}

  public async findOne(params: FindOneUserParams): Promise<User | null> {
    const entity = await this.users.findOne(params);

    return entity?.toDomain() ?? null;
  }

  public async save(user: User): Promise<User> {
    const entity = await this.users.save(UserTypeormEntity.fromDomain(user));

    return entity.toDomain();
  }
}
