import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import {
  type SSEMessage,
  type SSEStreamingApi,
  streamSSE,
} from "hono/streaming";
import { EventType } from "models";
import type { ConnectedEventData, EventDataMap, ValueEventData } from "models";

/**
 * Helper function for sending typed SSE events
 */
async function sendTypedEvent<T extends EventType>(
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

const eventsRoute = new Hono()
  // SSE endpoint
  .get("/", async (c) => {
    return streamSSE(
      c,
      async (streamSSE) => {
        streamSSE.onAbort(async () => {
          console.log("Aborted!");
          await streamSSE.close();
        });

        // Connected event
        const connectedData: ConnectedEventData = {
          message: "connected start",
        };
        await sendTypedEvent(
          streamSSE,
          EventType.CONNECTED,
          connectedData,
          randomUUID(),
        );

        await streamSSE.sleep(1000);

        // Event A
        const dataA: ValueEventData = { value: "a" };
        await sendTypedEvent(streamSSE, EventType.A, dataA);

        await streamSSE.sleep(1000);

        // Event B
        const dataB: ValueEventData = { value: "b" };
        await sendTypedEvent(streamSSE, EventType.B, dataB);

        await streamSSE.sleep(1000);

        // Event C
        const dataC: ValueEventData = { value: "c" };
        await sendTypedEvent(streamSSE, EventType.C, dataC);

        await streamSSE.sleep(1000);

        await streamSSE.close();
      },
      async (err, streamSSE) => {
        console.error(err);
        await streamSSE.writeln("An error occurred!");
        await streamSSE.close();
      },
    );
  });

export { eventsRoute };
