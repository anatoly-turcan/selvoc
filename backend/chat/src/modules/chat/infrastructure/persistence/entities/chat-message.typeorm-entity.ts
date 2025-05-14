import { PropertiesOf } from '@bobo/common';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { ChatMessage } from '../../../domain/entities';

import { ChatTypeormEntity } from './chat.typeorm-entity';

@Entity('chat_messages')
export class ChatMessageTypeormEntity {
  @PrimaryColumn('uuid')
  public id: string;

  @Column('uuid')
  public userId: string;

  @Column('uuid')
  public chatId: string;

  @Column('varchar')
  public content: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  public createdAt: Date;

  @Column('timestamp with time zone', { nullable: true })
  public updatedAt: Date | null;

  @ManyToOne(() => ChatTypeormEntity, (chat) => chat.messages, { onDelete: 'CASCADE' })
  public chat: ChatTypeormEntity;

  constructor(params?: Omit<PropertiesOf<ChatMessageTypeormEntity>, 'chat'>) {
    if (params) {
      this.id = params.id;
      this.userId = params.userId;
      this.chatId = params.chatId;
      this.content = params.content;
      this.createdAt = params.createdAt;
      this.updatedAt = params.updatedAt;
    }
  }

  public toDomain(): ChatMessage {
    return new ChatMessage(this);
  }

  public static fromDomain(entity: ChatMessage): ChatMessageTypeormEntity {
    return new ChatMessageTypeormEntity(entity);
  }
}
