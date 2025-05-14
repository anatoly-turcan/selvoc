import { PropertiesOf } from '@bobo/common';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { ChatMembership } from '../../../domain/entities';

import { ChatTypeormEntity } from './chat.typeorm-entity';

@Entity('chat_memberships')
export class ChatMembershipTypeormEntity {
  @PrimaryColumn('uuid')
  public chatId: string;

  @PrimaryColumn('uuid')
  public userId: string;

  @Column('timestamp with time zone')
  public joinedAt: Date;

  @ManyToOne(() => ChatTypeormEntity, (chat) => chat.memberships, { onDelete: 'CASCADE' })
  public chat: ChatTypeormEntity;

  constructor(params?: Omit<PropertiesOf<ChatMembershipTypeormEntity>, 'chat'>) {
    if (params) {
      this.chatId = params.chatId;
      this.userId = params.userId;
      this.joinedAt = params.joinedAt;
    }
  }

  public toDomain(): ChatMembership {
    return new ChatMembership(this);
  }

  public static fromDomain(entity: ChatMembership): ChatMembershipTypeormEntity {
    return new ChatMembershipTypeormEntity(entity);
  }
}
