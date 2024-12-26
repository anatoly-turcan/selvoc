export class ChatDoesNotExistException extends Error {
  constructor() {
    super('Chat does not exist');
  }
}
