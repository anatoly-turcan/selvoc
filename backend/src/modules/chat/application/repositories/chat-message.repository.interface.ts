import { ChatMessage } from '../../domain/entities';

export interface IChatMessageRepository {
  save(message: ChatMessage): Promise<ChatMessage>;
}
