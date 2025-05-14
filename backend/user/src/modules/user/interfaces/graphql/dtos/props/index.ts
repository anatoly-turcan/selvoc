import { UserPropsArgsGqlDto } from './user.props.args.dto';
import { UserPropsInputGqlDto } from './user.props.input.dto';
import { UserPropsObjectGqlDto } from './user.props.object.dto';

/**
 * Is a collection of GraphQL props DTOs, grouped by entity.
 * Use `GqlProps.<Entity>.<Type>` to access Args, Input, or Object props DTOs.
 *
 * Props DTOs are only used to build other DTOs using mapped types.
 *
 * Example: `GqlProps.User.Input` for User's InputType DTO.
 */
export const GqlProps = {
  User: {
    Args: UserPropsArgsGqlDto,
    Input: UserPropsInputGqlDto,
    Object: UserPropsObjectGqlDto,
  },
} as const;
