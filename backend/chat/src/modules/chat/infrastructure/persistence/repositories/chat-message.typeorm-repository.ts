import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChatMessageRepository } from '../../../application/repositories';
import { ChatMessage } from '../../../domain/entities';
import { ChatMessageTypeormEntity } from '../entities';

@Injectable()
export class ChatMessageTypeormRepository implements ChatMessageRepository {
  constructor(
    @InjectRepository(ChatMessageTypeormEntity)
    private readonly messages: Repository<ChatMessageTypeormEntity>,
  ) {}

  public async save(message: ChatMessage): Promise<ChatMessage> {
    const entity = await this.messages.save(ChatMessageTypeormEntity.fromDomain(message));

    return entity.toDomain();
  }
}
