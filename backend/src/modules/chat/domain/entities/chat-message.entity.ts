import crypto from 'crypto';

import { Chat } from './chat.entity';

export type BuildChatMessageParams = {
  id?: string;
  userId: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
} & ({ chat: Chat } | { chatId: string });

export class ChatMessage {
  public id: string;

  public chatId: string;

  public userId: string;

  public content: string;

  public createdAt: Date;

  public updatedAt: Date | null;

  constructor(params: BuildChatMessageParams) {
    this.id = params.id ?? crypto.randomUUID();
    this.chatId = 'chatId' in params ? params.chatId : params.chat.id;
    this.userId = params.userId;
    this.content = params.content;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? null;
  }
}
