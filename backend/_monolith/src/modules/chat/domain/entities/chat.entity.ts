import crypto from 'crypto';

import { BuildTimestampsParams, Timestamps } from '@common/domain';

export type BuildChatParams = {
  id?: string;
  name: string;
  lastMessageId?: string | null;
  timestamps?: BuildTimestampsParams;
};

export class Chat {
  public id: string;

  public name: string;

  public lastMessageId: string | null;

  public timestamps: Timestamps;

  constructor(params: BuildChatParams) {
    this.id = params.id ?? crypto.randomUUID();
    this.name = params.name;
    this.lastMessageId = params.lastMessageId ?? null;
    this.timestamps = params.timestamps ? new Timestamps(params.timestamps) : Timestamps.now();
  }

  public update(data: Partial<Omit<BuildChatParams, 'timestamps'>>): this {
    this.id = data.id ?? this.id;
    this.name = data.name ?? this.name;
    this.lastMessageId = data.lastMessageId ?? this.lastMessageId;
    this.timestamps.updated();

    return this;
  }
}
