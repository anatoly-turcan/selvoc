import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MemoryEventTransport } from '@common/event-client-transport-memory';
import { NestEventClientModule } from '@common/nest-event-client';

import {
  CHAT_MEMBERSHIP_REPOSITORY_TOKEN,
  CHAT_MESSAGE_REPOSITORY_TOKEN,
  CHAT_REPOSITORY_TOKEN,
} from './application/constants';
import { ChatService } from './application/services';
import { ChatMessageCreatedEvent } from './domain/events';
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
    ConfigModule.forFeature(() => ({})),
    TypeOrmModule.forFeature([
      ChatTypeormEntity,
      ChatMembershipTypeormEntity,
      ChatMessageTypeormEntity,
    ]),
    NestEventClientModule.forRootAsync({
      // imports: [forwardRef(() => ChatModule)],
      // inject: [ChatResolver],
      useFactory: () => ({
        transports: [new MemoryEventTransport([ChatMessageCreatedEvent])],
        logger: console,
      }),
      // useFactory: (chatResolver: ChatResolver) => ({
      //   transports: [
      //     new NestGqlEventTransport({
      //       resolver: chatResolver,
      //       events: [{ event: ChatMessageCreatedEvent, subscriptionName: 'onChatMessageCreated' }],
      //     }),
      //   ],
      //   logger: console,
      // }),
    }),
  ],
  providers: [
    ChatService,
    ChatResolver,
    { provide: CHAT_REPOSITORY_TOKEN, useClass: ChatTypeormRepository },
    { provide: CHAT_MEMBERSHIP_REPOSITORY_TOKEN, useClass: ChatMembershipTypeormRepository },
    { provide: CHAT_MESSAGE_REPOSITORY_TOKEN, useClass: ChatMessageTypeormRepository },
  ],
  exports: [ChatResolver],
})
export class ChatModule {}
