export class ChatNotFoundException extends Error {
  constructor() {
    super('Chat not found');
  }
}
