import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PubSubAsyncIterableIterator } from 'graphql-subscriptions/dist/pubsub-async-iterable-iterator';

import { EventInterceptor, EventListener, getEventKey } from '@common/event-client';
import { ChatService } from '@modules/chat/application/services';
import { ChatMessageCreatedEvent } from '@modules/chat/domain/events';

import {
  ChatResponseGqlDto,
  CreateChatQueryGqlDto,
  GetChatGqlQueryDto,
  InviteChatMemberQueryGqlDto,
  SendChatMessageQueryGqlDto,
} from '../dtos';
import { ChatMessageCreatedGqlEvent } from '../events';

// TODO: add auth
const actorId = '64c4e6fc-f286-4d41-aa7e-6155b908bfb4';

@Resolver(() => ChatResponseGqlDto)
@EventInterceptor()
export class ChatResolver {
  private readonly pubSub: PubSub;

  constructor(private readonly chatService: ChatService) {
    this.pubSub = new PubSub();
  }

  @Query(() => ChatResponseGqlDto, { name: 'chat', nullable: true })
  public async getOne(@Args() args: GetChatGqlQueryDto): Promise<ChatResponseGqlDto> {
    const chat = await this.chatService.getById(args.id, actorId);

    return new ChatResponseGqlDto(chat);
  }

  @Query(() => [ChatResponseGqlDto], { name: 'chats' })
  public async getAll(): Promise<ChatResponseGqlDto[]> {
    const chats = await this.chatService.getAllByUserId(actorId);

    return chats.map((chat) => new ChatResponseGqlDto(chat));
  }

  @Mutation(() => ChatResponseGqlDto, { name: 'createChat' })
  public async create(@Args('data') args: CreateChatQueryGqlDto): Promise<ChatResponseGqlDto> {
    const chat = await this.chatService.create(args, actorId);

    return new ChatResponseGqlDto(chat);
  }

  @Mutation(() => Boolean, { name: 'inviteChatMember' })
  public async inviteMember(@Args('data') args: InviteChatMemberQueryGqlDto): Promise<boolean> {
    await this.chatService.inviteMember(args, actorId);

    return true;
  }

  @Mutation(() => Boolean, { name: 'sendMessage' })
  public async sendMessage(@Args('data') args: SendChatMessageQueryGqlDto): Promise<boolean> {
    await this.chatService.sendMessage(args, actorId);

    return true;
  }

  @Subscription(() => ChatMessageCreatedGqlEvent, {
    name: ChatMessageCreatedGqlEvent.SUBSCRIPTION_NAME,
  })
  public onChatMessageCreated(): PubSubAsyncIterableIterator<unknown> {
    return this.pubSub.asyncIterableIterator(getEventKey(ChatMessageCreatedEvent));
  }

  @EventListener(ChatMessageCreatedEvent)
  public async onEvent(event: ChatMessageCreatedEvent): Promise<void> {
    await this.pubSub.publish(getEventKey(event), {
      [ChatMessageCreatedGqlEvent.SUBSCRIPTION_NAME]: ChatMessageCreatedGqlEvent.fromDomain(event),
    });
  }
}
