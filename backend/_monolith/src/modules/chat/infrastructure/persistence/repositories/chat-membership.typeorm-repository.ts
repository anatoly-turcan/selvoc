import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  FindManyChatMembershipsParams,
  IChatMembershipRepository,
} from '@modules/chat/application/repositories';
import { ChatMembership } from '@modules/chat/domain/entities';

import { ChatMembershipTypeormEntity } from '../entities';

@Injectable()
export class ChatMembershipTypeormRepository implements IChatMembershipRepository {
  constructor(
    @InjectRepository(ChatMembershipTypeormEntity)
    private readonly memberships: Repository<ChatMembershipTypeormEntity>,
  ) {}

  public async save(membership: ChatMembership): Promise<ChatMembership> {
    const entity = await this.memberships.save(ChatMembershipTypeormEntity.fromDomain(membership));

    return entity.toDomain();
  }

  public async exists(chatId: string, userId: string): Promise<boolean> {
    return this.memberships.existsBy({ chatId, userId });
  }

  public async findMany(params: FindManyChatMembershipsParams): Promise<ChatMembership[]> {
    const entities = await this.memberships.find(params);

    return entities.map((entity) => entity.toDomain());
  }
}
