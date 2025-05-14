import { BadRequestException } from '@bobo/common';

export class UserAlreadyMemberException extends BadRequestException {
  constructor() {
    super('The user is already a member of this group');
  }
}
