import { NotFoundException } from '@selvoc/common';

export class ChatNotFoundException extends NotFoundException {
  constructor() {
    super('Chat not found');
  }
}
