import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../domain';
import { USER_REPOSITORY_TOKEN } from '../constants';
import { UserNotFoundException } from '../exceptions';
import { IUserRepository } from '../repositories';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly users: IUserRepository,
  ) {}

  public async getById(id: string): Promise<User> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  public async findByUsername(username: string): Promise<User | null> {
    return this.users.findOne({ where: { username } });
  }
}
