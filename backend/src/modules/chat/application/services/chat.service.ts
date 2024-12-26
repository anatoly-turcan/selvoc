import { Inject, Injectable } from '@nestjs/common';

import { AccessDeniedException } from '@common/application/exceptions';
import { EventClient } from '@common/event-client';

import {
  CHAT_MEMBER_REPOSITORY_TOKEN,
  CHAT_MESSAGE_REPOSITORY_TOKEN,
  CHAT_REPOSITORY_TOKEN,
} from '../../domain/constants';
import { Chat, ChatMember, ChatMessage } from '../../domain/entities';
import { ChatMemberJoinedEvent, ChatMessageCreatedEvent } from '../../domain/events';
import { ChatDoesNotExistException } from '../exceptions';
import { IChatMemberRepository, IChatMessageRepository, IChatRepository } from '../repositories';

export type CreateChatParams = {
  name: string;
};

export type InviteChatMemberParams = AddChatMemberParams;

export type SendChatMessageParams = {
  chatId: string;
  content: string;
};

export type ShouldNotifyChatUserParams = {
  chatId: string;
  userId: string;
};

type AddChatMemberParams = {
  chatId: string;
  userId: string;
};

@Injectable()
export class ChatService {
  constructor(
    @Inject(CHAT_REPOSITORY_TOKEN)
    private readonly chats: IChatRepository,
    @Inject(CHAT_MEMBER_REPOSITORY_TOKEN)
    private readonly chatMembers: IChatMemberRepository,
    @Inject(CHAT_MESSAGE_REPOSITORY_TOKEN)
    private readonly chatMessages: IChatMessageRepository,
    private readonly events: EventClient,
  ) {}

  public async create(params: CreateChatParams, actorId: string): Promise<Chat> {
    const chat = await this.chats.create(new Chat(params));

    await this.addMember({ chatId: chat.id, userId: actorId });

    return chat;
  }

  public async inviteMember(params: InviteChatMemberParams, actorId: string): Promise<void> {
    await this.assertExists(params.chatId);
    await this.assertAccess(params.chatId, actorId);

    await this.addMember(params);
  }

  public async sendMessage(params: SendChatMessageParams, actorId: string): Promise<void> {
    await this.assertExists(params.chatId);
    await this.assertAccess(params.chatId, actorId);

    const message = await this.chatMessages.create(new ChatMessage({ ...params, userId: actorId }));

    await this.events.produce(ChatMessageCreatedEvent.fromMessage(message));
  }

  public async shouldNotifyUser(params: ShouldNotifyChatUserParams): Promise<boolean> {
    return this.isMember(params.chatId, params.userId);
  }

  private async addMember(params: AddChatMemberParams): Promise<ChatMember> {
    const member = await this.chatMembers.create(new ChatMember(params));

    await this.events.produce(ChatMemberJoinedEvent.fromMember(member));

    return member;
  }

  private async isMember(chatId: string, userId: string): Promise<boolean> {
    return this.chatMembers.exists(chatId, userId);
  }

  private async assertExists(chatId: string): Promise<void> {
    const doesExist = this.chats.exists(chatId);
    if (!doesExist) {
      throw new ChatDoesNotExistException();
    }
  }

  private async assertAccess(chatId: string, actorId: string): Promise<void> {
    const isMember = await this.isMember(chatId, actorId);
    if (!isMember) {
      throw new AccessDeniedException();
    }
  }
}
