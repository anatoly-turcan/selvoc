import { InputType, PickType } from '@nestjs/graphql';

import { CreateChatParams } from '@modules/chat/application/services';

import { ChatPropsInputGqlDto } from '../props';

@InputType('CreateChatQuery')
export class CreateChatQueryGqlDto
  extends PickType(ChatPropsInputGqlDto, ['name'])
  implements CreateChatParams {}
