import crypto from 'crypto';

import { BuildTimestampsParams, Timestamps } from '@common/domain';

export type BuildChatParams = {
  id?: string;
  name: string;
  timestamps?: BuildTimestampsParams;
};

export class Chat {
  public id: string;

  public name: string;

  public timestamps: Timestamps;

  constructor(params: BuildChatParams) {
    this.id = params.id ?? crypto.randomUUID();
    this.name = params.name;
    this.timestamps = params.timestamps ? new Timestamps(params.timestamps) : Timestamps.now();
  }
}
