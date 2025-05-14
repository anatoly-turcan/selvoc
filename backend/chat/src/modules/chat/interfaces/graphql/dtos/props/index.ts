import { ChatPropsArgsGqlDto } from './chat.props.args.dto';
import { ChatPropsInputGqlDto } from './chat.props.input.dto';
import { ChatPropsObjectGqlDto } from './chat.props.object.dto';

/**
 * Is a collection of GraphQL props DTOs, grouped by entity.
 * Use `GqlProps.<Entity>.<Type>` to access Args, Input, or Object props DTOs.
 *
 * Props DTOs are only used to build other DTOs using mapped types.
 *
 * Example: `GqlProps.Chat.Input` for Chat's InputType DTO.
 */
export const GqlProps = {
  Chat: {
    Args: ChatPropsArgsGqlDto,
    Input: ChatPropsInputGqlDto,
    Object: ChatPropsObjectGqlDto,
  },
} as const;
