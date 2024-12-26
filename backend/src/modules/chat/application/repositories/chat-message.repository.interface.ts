import { ChatMessage } from '../../domain/entities';

export interface IChatMessageRepository {
  create(member: ChatMessage): Promise<ChatMessage>;
}
