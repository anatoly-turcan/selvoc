import crypto from 'crypto';

export type BuildChatParams = {
  id?: string;
  name: string;
  lastMessageId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Chat {
  public id: string;

  public name: string;

  public lastMessageId: string | null;

  public createdAt: Date;

  public updatedAt: Date;

  constructor(params: BuildChatParams) {
    const now = new Date();

    this.id = params.id ?? crypto.randomUUID();
    this.name = params.name;
    this.lastMessageId = params.lastMessageId ?? null;
    this.createdAt = params.createdAt ?? now;
    this.updatedAt = params.updatedAt ?? now;
  }

  public update(data: Partial<Omit<BuildChatParams, 'createdAt' | 'updatedAt'>>): this {
    this.id = data.id ?? this.id;
    this.name = data.name ?? this.name;
    this.lastMessageId = data.lastMessageId ?? this.lastMessageId;
    this.updatedAt = new Date();

    return this;
  }
}
