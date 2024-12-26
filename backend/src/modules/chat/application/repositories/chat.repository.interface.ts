import { Chat } from '../../domain/entities';

export interface IChatRepository {
  create(chat: Chat): Promise<Chat>;
  exists(chatId: string): Promise<boolean>;
}
