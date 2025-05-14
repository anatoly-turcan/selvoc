import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CHAT_MEMBERSHIP_REPOSITORY_TOKEN,
  CHAT_MESSAGE_REPOSITORY_TOKEN,
  CHAT_REPOSITORY_TOKEN,
} from './application/constants';
import { ChatService } from './application/services';
import {
  ChatMembershipTypeormEntity,
  ChatMembershipTypeormRepository,
  ChatMessageTypeormEntity,
  ChatMessageTypeormRepository,
  ChatTypeormEntity,
  ChatTypeormRepository,
} from './infrastructure/persistence';
import { ChatResolver } from './interfaces/graphql';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatTypeormEntity,
      ChatMembershipTypeormEntity,
      ChatMessageTypeormEntity,
    ]),
  ],
  providers: [
    ChatService,
    ChatResolver,
    { provide: CHAT_REPOSITORY_TOKEN, useClass: ChatTypeormRepository },
    { provide: CHAT_MEMBERSHIP_REPOSITORY_TOKEN, useClass: ChatMembershipTypeormRepository },
    { provide: CHAT_MESSAGE_REPOSITORY_TOKEN, useClass: ChatMessageTypeormRepository },
  ],
})
export class ChatModule {}
