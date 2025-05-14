import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { IChatRepository } from '../../../application/repositories';
import { Chat } from '../../../domain/entities';
import { ChatTypeormEntity } from '../entities';

@Injectable()
export class ChatTypeormRepository implements IChatRepository {
  constructor(
    @InjectRepository(ChatTypeormEntity)
    private readonly chats: Repository<ChatTypeormEntity>,
  ) {}

  public async save(chat: Chat): Promise<Chat> {
    const entity = await this.chats.save(ChatTypeormEntity.fromDomain(chat));

    return entity.toDomain();
  }

  public async exists(id: string): Promise<boolean> {
    return this.chats.existsBy({ id });
  }

  public async findById(id: string): Promise<Chat | null> {
    const entity = await this.chats.findOne({ where: { id } });

    return entity?.toDomain() ?? null;
  }

  public async findByIds(ids: string[]): Promise<Chat[]> {
    const entities = await this.chats.find({ where: { id: In(ids) } });

    return entities.map((entity) => entity.toDomain());
  }
}
