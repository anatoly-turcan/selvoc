import { AccessDeniedException } from '@bobo/common';
import { EventClient, EventInterceptor, EventListener } from '@bobo/event-client';
import { Inject, Injectable } from '@nestjs/common';

import { Chat, ChatMembership, ChatMessage } from '../../domain/entities';
import { ChatMemberJoinedEvent, ChatMessageCreatedEvent } from '../../domain/events';
import {
  CHAT_MEMBERSHIP_REPOSITORY_TOKEN,
  CHAT_MESSAGE_REPOSITORY_TOKEN,
  CHAT_REPOSITORY_TOKEN,
} from '../constants';
import { ChatNotFoundException, UserAlreadyMemberException } from '../exceptions';
import {
  IChatMembershipRepository,
  IChatMessageRepository,
  IChatRepository,
} from '../repositories';

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
@EventInterceptor()
export class ChatService {
  constructor(
    @Inject(CHAT_REPOSITORY_TOKEN)
    private readonly chats: IChatRepository,
    @Inject(CHAT_MEMBERSHIP_REPOSITORY_TOKEN)
    private readonly chatMemberships: IChatMembershipRepository,
    @Inject(CHAT_MESSAGE_REPOSITORY_TOKEN)
    private readonly chatMessages: IChatMessageRepository,
    private readonly events: EventClient,
  ) {}

  public async create(params: CreateChatParams, actorId: string): Promise<Chat> {
    const chat = await this.chats.save(new Chat(params));

    await this.addMember({ chatId: chat.id, userId: actorId });

    return chat;
  }

  public async inviteMember(params: InviteChatMemberParams, actorId: string): Promise<void> {
    await this.assertExists(params.chatId);
    await this.assertAccess(params.chatId, actorId);
    await this.assertNotMember(params.chatId, params.userId);

    await this.addMember(params);
  }

  public async sendMessage(params: SendChatMessageParams, actorId: string): Promise<void> {
    await this.assertExists(params.chatId);
    await this.assertAccess(params.chatId, actorId);

    const message = await this.chatMessages.save(new ChatMessage({ ...params, userId: actorId }));

    await this.events.produce(ChatMessageCreatedEvent.fromMessage(message));
  }

  public async shouldNotifyUser(chatId: string, userId: string): Promise<boolean> {
    return this.isMember(chatId, userId);
  }

  public async getAllByUserId(userId: string): Promise<Chat[]> {
    const memberships = await this.chatMemberships.findMany({ where: { userId } });

    return this.chats.findByIds(memberships.map((m) => m.chatId));
  }

  public async getById(id: string, actorId?: string): Promise<Chat> {
    const chat = await this.chats.findById(id);
    if (!chat) {
      throw new ChatNotFoundException();
    }

    if (actorId) {
      await this.assertAccess(id, actorId);
    }

    return chat;
  }

  @EventListener(ChatMessageCreatedEvent)
  public async onChatMessageCreated(event: ChatMessageCreatedEvent): Promise<void> {
    const chat = await this.getById(event.chatId);

    await this.chats.save(chat.update({ lastMessageId: event.messageId }));
  }

  private async addMember(params: AddChatMemberParams): Promise<ChatMembership> {
    const membership = await this.chatMemberships.save(new ChatMembership(params));

    await this.events.produce(ChatMemberJoinedEvent.fromMembership(membership));

    return membership;
  }

  private async isMember(chatId: string, userId: string): Promise<boolean> {
    return this.chatMemberships.exists(chatId, userId);
  }

  private async assertExists(chatId: string): Promise<void> {
    const doesExist = this.chats.exists(chatId);
    if (!doesExist) {
      throw new ChatNotFoundException();
    }
  }

  private async assertAccess(chatId: string, actorId: string): Promise<void> {
    const isMember = await this.isMember(chatId, actorId);
    if (!isMember) {
      throw new AccessDeniedException();
    }
  }

  private async assertNotMember(chatId: string, userId: string): Promise<void> {
    const isMember = await this.isMember(chatId, userId);
    if (isMember) {
      throw new UserAlreadyMemberException();
    }
  }
}
