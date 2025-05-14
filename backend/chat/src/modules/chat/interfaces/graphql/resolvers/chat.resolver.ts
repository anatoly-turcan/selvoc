import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Actor, RequestActor } from '@selvoc/nest-auth';

import { ChatService } from '../../../application/services';
import { GetChatArgs } from '../dtos/args';
import { CreateChatInput, InviteChatMemberInput, SendChatMessageInput } from '../dtos/inputs';
import { ChatResponseGqlDto } from '../dtos/responses';

@Resolver(() => ChatResponseGqlDto)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Query(() => ChatResponseGqlDto, { name: 'chat', nullable: true })
  public async getOne(
    @Args() args: GetChatArgs,
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
    @Args('data') args: CreateChatInput,
    @Actor() actor: RequestActor,
  ): Promise<ChatResponseGqlDto> {
    const chat = await this.chatService.create(args, actor.id);

    return new ChatResponseGqlDto(chat);
  }

  @Mutation(() => Boolean, { name: 'inviteChatMember' })
  public async inviteMember(
    @Args('data') args: InviteChatMemberInput,
    @Actor() actor: RequestActor,
  ): Promise<boolean> {
    await this.chatService.inviteMember(args, actor.id);

    return true;
  }

  @Mutation(() => Boolean, {
    name: 'sendMessage',
    deprecationReason: 'will be replaced with websocket gateway',
  })
  public async sendMessage(
    @Args('data') args: SendChatMessageInput,
    @Actor() actor: RequestActor,
  ): Promise<boolean> {
    await this.chatService.sendMessage(args, actor.id);

    return true;
  }
}
