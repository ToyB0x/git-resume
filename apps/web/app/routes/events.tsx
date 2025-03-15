import { fetchEventSource } from "@microsoft/fetch-event-source";
import { EventType } from "models";
import type { ValueEventData } from "models";
import { useEffect, useState } from "react";

// Using a Record type with fixed keys for EventsState
type EventsState = Record<"a" | "b" | "c", ValueEventData | null>;

export default function EventsPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<EventsState>({
    a: null,
    b: null,
    c: null,
  });

  useEffect(() => {
    const abortController = new AbortController();
    let retryCount = 0;
    const MAX_RETRIES = 5;

    const connectToEventSource = async () => {
      try {
        await fetchEventSource("http://localhost:3000/api/events", {
          signal: abortController.signal,

          onopen: async (response) => {
            if (response.ok) {
              setIsConnected(true);
              retryCount = 0;
              console.log("Connection opened");
            } else {
              const error = await response.text();
              console.error(`Failed to connect: ${error}`);
              throw new Error(`Failed to connect: ${response.status} ${error}`);
            }
          },

          onmessage: (event) => {
            const { event: eventTypeStr, data } = event;
            const parsedData = JSON.parse(data);

            // Type guard to ensure eventType is a valid EventType
            const isValidEventType = (type: string): type is EventType => {
              return Object.values(EventType).includes(type as EventType);
            };

            if (!isValidEventType(eventTypeStr)) {
              console.warn(`Received unknown event type: ${eventTypeStr}`);
              return;
            }

            const eventType = eventTypeStr as EventType;

            if (eventType === EventType.CONNECTED) {
              console.log("Connected:", parsedData.message);
            } else if (
              eventType === EventType.A ||
              eventType === EventType.B ||
              eventType === EventType.C
            ) {
              // Using the string value directly since our state uses string keys
              const key = eventType as string as keyof EventsState;

              // Type assertion is safe because we've checked that eventType is one of these values
              setEvents((prev) => ({
                ...prev,
                [key]: parsedData,
              }));
            }
          },

          onerror: (err) => {
            console.error("EventSource error:", err);
            setIsConnected(false);

            retryCount++;
            if (retryCount > MAX_RETRIES) {
              console.error(`Max retries (${MAX_RETRIES}) reached`);
              abortController.abort();
              return;
            }

            // Allow the fetchEventSource to retry automatically
            // according to its retry strategy
            return;
          },

          onclose: () => {
            console.log("Connection closed");
            setIsConnected(false);
          },
        });
      } catch (err) {
        console.error("Error connecting to event source:", err);
        setIsConnected(false);
      }
    };

    connectToEventSource();

    // Clean up on component unmount
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SSE Events Demo</h1>

      <div className="mb-4">
        <span className="font-medium mr-2">Connection Status:</span>
        <span className={`${isConnected ? "text-green-600" : "text-red-600"}`}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <EventCard type={EventType.A} data={events.a} />
        <EventCard type={EventType.B} data={events.b} />
        <EventCard type={EventType.C} data={events.c} />
      </div>
    </div>
  );
}

function EventCard({
  type,
  data,
}: {
  type: EventType.A | EventType.B | EventType.C;
  data: ValueEventData | null;
}) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Event Type: {type}</h2>

      {data ? (
        <>
          <p className="mb-1">
            <span className="font-medium">Value:</span> {data.value}
          </p>
        </>
      ) : (
        <p className="text-gray-400">Waiting for data...</p>
      )}
    </div>
  );
}
