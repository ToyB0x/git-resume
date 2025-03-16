import type { EventDataMap, EventType } from "@resume/models";
import type { SSEMessage, SSEStreamingApi } from "hono/streaming";

/**
 * Helper function for sending typed SSE events
 */
export async function sendTypedEvent<T extends EventType>(
  stream: SSEStreamingApi,
  eventType: T,
  data: EventDataMap[T],
  id?: string,
) {
  const message: SSEMessage = {
    event: eventType,
    data: JSON.stringify(data),
  };

  if (id) {
    message.id = id;
  }

  await stream.writeSSE(message);
}
