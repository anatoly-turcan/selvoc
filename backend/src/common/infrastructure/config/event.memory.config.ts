import { MemoryEventTransport } from '@common/event-client-transport-memory';
import { ChatMessageCreatedEvent } from '@modules/chat/domain/events';

export type MemoryEventsConfig = ConstructorParameters<typeof MemoryEventTransport>[0];

export const memoryEventsConfig = [ChatMessageCreatedEvent];
