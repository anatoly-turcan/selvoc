export class UserAlreadyMemberException extends Error {
  constructor() {
    super('The user is already a member of this group');
  }
}
