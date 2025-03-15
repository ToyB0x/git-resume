import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";

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

        await streamSSE.writeSSE({
          data: JSON.stringify({ message: "connected start" }),
          event: "connected",
          id: randomUUID(),
        });

        await streamSSE.sleep(1000);

        await streamSSE.writeSSE({
          event: "a",
          data: JSON.stringify({ value: "a" }),
        });

        await streamSSE.sleep(1000);

        await streamSSE.writeSSE({
          event: "b",
          data: JSON.stringify({ value: "b" }),
        });

        await streamSSE.sleep(1000);

        await streamSSE.writeSSE({
          event: "c",
          data: JSON.stringify({ value: "c" }),
        });
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
