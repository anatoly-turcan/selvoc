import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PubSubAsyncIterableIterator } from 'graphql-subscriptions/dist/pubsub-async-iterable-iterator';

import { EventInterceptor, EventListener, getEventKey } from '@common/event-client';
import { Actor, RequestActor } from '@common/nest-auth';
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

@Resolver(() => ChatResponseGqlDto)
@EventInterceptor()
export class ChatResolver {
  private readonly pubSub: PubSub;

  constructor(private readonly chatService: ChatService) {
    this.pubSub = new PubSub();
  }

  @Query(() => ChatResponseGqlDto, { name: 'chat', nullable: true })
  public async getOne(
    @Args() args: GetChatGqlQueryDto,
    @Actor() actor: RequestActor,
  ): Promise<ChatResponseGqlDto> {
    const chat = await this.chatService.getById(args.id, actor.id);

    return new ChatResponseGqlDto(chat);
  }

  @Query(() => [ChatResponseGqlDto], { name: 'chats' })
  public async getAll(@Actor() actor: RequestActor): Promise<ChatResponseGqlDto[]> {
    const chats = await this.chatService.getAllByUserId(actor.id);

    return chats.map((chat) => new ChatResponseGqlDto(chat));
  }

  @Mutation(() => ChatResponseGqlDto, { name: 'createChat' })
  public async create(
    @Args('data') args: CreateChatQueryGqlDto,
    @Actor() actor: RequestActor,
  ): Promise<ChatResponseGqlDto> {
    const chat = await this.chatService.create(args, actor.id);

    return new ChatResponseGqlDto(chat);
  }

  @Mutation(() => Boolean, { name: 'inviteChatMember' })
  public async inviteMember(
    @Args('data') args: InviteChatMemberQueryGqlDto,
    @Actor() actor: RequestActor,
  ): Promise<boolean> {
    await this.chatService.inviteMember(args, actor.id);

    return true;
  }

  @Mutation(() => Boolean, { name: 'sendMessage' })
  public async sendMessage(
    @Args('data') args: SendChatMessageQueryGqlDto,
    @Actor() actor: RequestActor,
  ): Promise<boolean> {
    await this.chatService.sendMessage(args, actor.id);

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
