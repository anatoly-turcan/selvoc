import { PropertiesOf } from '@selvoc/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Chat } from '../../../domain/entities';

import { ChatMembershipTypeormEntity } from './chat-membership.typeorm-entity';
import { ChatMessageTypeormEntity } from './chat-message.typeorm-entity';

@Entity('chats')
export class ChatTypeormEntity {
  @PrimaryColumn('uuid')
  public id: string;

  @Column('varchar')
  public name: string;

  @Column('uuid', { nullable: true })
  public lastMessageId: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  public updatedAt: Date;

  @OneToMany(() => ChatMembershipTypeormEntity, (membership) => membership.chat)
  public memberships: ChatMembershipTypeormEntity[];

  @OneToMany(() => ChatMessageTypeormEntity, (membership) => membership.chat)
  public messages: ChatMessageTypeormEntity[];

  @ManyToOne(() => ChatMessageTypeormEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  public lastMessage: ChatMessageTypeormEntity | null;

  constructor(
    params?: Omit<PropertiesOf<ChatTypeormEntity>, 'memberships' | 'messages' | 'lastMessage'>,
  ) {
    if (params) {
      this.id = params.id;
      this.name = params.name;
      this.lastMessageId = params.lastMessageId;
      this.createdAt = params.createdAt;
      this.updatedAt = params.updatedAt;
    }
  }

  public toDomain(): Chat {
    return new Chat(this);
  }

  public static fromDomain(entity: Chat): ChatTypeormEntity {
    return new ChatTypeormEntity(entity);
  }
}
