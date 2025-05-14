import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@selvoc/common';

import { User } from '../../domain/entities';
import { USER_REPOSITORY_TOKEN } from '../constants';
import { UserRepository } from '../repositories';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly users: UserRepository,
  ) {}

  public async getById(id: string): Promise<User> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  public async findByUsername(username: string): Promise<User | null> {
    return this.users.findOne({ where: { username } });
  }
}
