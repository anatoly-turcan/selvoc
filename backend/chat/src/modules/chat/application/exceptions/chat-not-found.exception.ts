import { NotFoundException } from '@bobo/common';

export class ChatNotFoundException extends NotFoundException {
  constructor() {
    super('Chat not found');
  }
}
