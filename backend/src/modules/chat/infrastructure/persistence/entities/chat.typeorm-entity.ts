import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PropertiesOf } from '@common/utils';
import { Chat } from '@modules/chat/domain/entities';

import { ChatMembershipTypeormEntity } from './chat-membership.typeorm-entity';
import { ChatMessageTypeormEntity } from './chat-message.typeorm-entity';

@Entity('chats')
export class ChatTypeormEntity {
  @PrimaryColumn('uuid')
  public id: string;

  @Column('varchar')
  public name: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  public updatedAt: Date;

  @OneToMany(() => ChatMembershipTypeormEntity, (membership) => membership.chat)
  public memberships: ChatMembershipTypeormEntity[];

  @OneToMany(() => ChatMessageTypeormEntity, (membership) => membership.chat)
  public messages: ChatMessageTypeormEntity[];

  constructor(params?: Omit<PropertiesOf<ChatTypeormEntity>, 'memberships' | 'messages'>) {
    if (params) {
      this.id = params.id;
      this.name = params.name;
      this.createdAt = params.createdAt;
      this.updatedAt = params.updatedAt;
    }
  }

  public toDomain(): Chat {
    const { createdAt, updatedAt, ...commonProps } = this;

    return new Chat({ ...commonProps, timestamps: { createdAt, updatedAt } });
  }

  public static fromDomain(entity: Chat): ChatTypeormEntity {
    const { timestamps, ...commonProps } = entity;

    return new ChatTypeormEntity({ ...commonProps, ...timestamps });
  }
}
