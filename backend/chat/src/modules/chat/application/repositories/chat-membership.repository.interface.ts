import { NonNullableObject } from '@selvoc/common';

import { ChatMembership } from '../../domain/entities';

export type ChatMembershipFilterParams = NonNullableObject<Partial<ChatMembership>>;

export type FindManyChatMembershipsParams = { where: ChatMembershipFilterParams };

export interface ChatMembershipRepository {
  save(membership: ChatMembership): Promise<ChatMembership>;
  exists(chatId: string, userId: string): Promise<boolean>;
  findMany(params: FindManyChatMembershipsParams): Promise<ChatMembership[]>;
}
