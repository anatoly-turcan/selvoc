import { ChatMessage } from '../../domain/entities';

export interface ChatMessageRepository {
  save(message: ChatMessage): Promise<ChatMessage>;
}
