import { IUserRepository } from '@modules/user/application/repositories';
import { User } from '@modules/user/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserMapper } from './user.mapper';
import { UserTypeormEntity } from './user.typeorm-entity';

@Injectable()
export class UserTypeormRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserTypeormEntity) private readonly users: Repository<UserTypeormEntity>,
  ) {}

  public async findById(id: string): Promise<User | null> {
    const entity = await this.users.findOne({ where: { id } });

    return entity && UserMapper.toDomain(entity);
  }

  public async save(user: User): Promise<User> {
    const entity = await this.users.save(UserMapper.toPersistence(user));

    return UserMapper.toDomain(entity);
  }
}
