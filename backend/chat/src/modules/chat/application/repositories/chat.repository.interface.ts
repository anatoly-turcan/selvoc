import { Chat } from '../../domain/entities';

// export type ChatFilterParams = NonNullableObject<Partial<Omit<Chat, 'timestamps'>>>;

// export type FindManyChatsParams = ChatFilterParams;

export interface ChatRepository {
  save(chat: Chat): Promise<Chat>;
  exists(id: string): Promise<boolean>;
  findById(id: string): Promise<Chat | null>;
  findByIds(ids: string[]): Promise<Chat[]>;
}
