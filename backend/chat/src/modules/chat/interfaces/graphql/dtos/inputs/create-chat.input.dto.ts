import { InputType, PickType } from '@nestjs/graphql';

import { CreateChatParams } from '../../../../application/services';
import { GqlProps } from '../props';

@InputType()
export class CreateChatInput
  extends PickType(GqlProps.Chat.Input, ['name'])
  implements CreateChatParams {}
