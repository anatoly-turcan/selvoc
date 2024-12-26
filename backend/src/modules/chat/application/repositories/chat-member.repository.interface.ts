import { ChatMember } from '../../domain/entities';

export interface IChatMemberRepository {
  create(member: ChatMember): Promise<ChatMember>;
  exists(chatId: string, userId: string): Promise<boolean>;
}
