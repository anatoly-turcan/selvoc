import { Chat } from './chat.entity';

export type BuildChatMemberParams = {
  userId: string;
  joinedAt?: Date;
} & ({ chat: Chat } | { chatId: string });

export class ChatMember {
  public chatId: string;

  public userId: string;

  public joinedAt: Date;

  constructor(params: BuildChatMemberParams) {
    this.chatId = 'chatId' in params ? params.chatId : params.chat.id;
    this.userId = params.userId;
    this.joinedAt = params.joinedAt ?? new Date();
  }
}
