import { Chat } from './chat.entity';

export type BuildChatMembershipParams = {
  userId: string;
  joinedAt?: Date;
} & ({ chat: Chat } | { chatId: string });

export class ChatMembership {
  public chatId: string;

  public userId: string;

  public joinedAt: Date;

  constructor(params: BuildChatMembershipParams) {
    this.chatId = 'chatId' in params ? params.chatId : params.chat.id;
    this.userId = params.userId;
    this.joinedAt = params.joinedAt ?? new Date();
  }
}
