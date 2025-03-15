import { useEffect, useState } from "react";

interface EventData {
  value: string;
}

export default function EventsPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<{
    a: EventData | null;
    b: EventData | null;
    c: EventData | null;
  }>({
    a: null,
    b: null,
    c: null,
  });

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/api/events");

    // Handle connection open
    eventSource.onopen = () => {
      setIsConnected(true);
    };

    // Handle connection error
    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      setIsConnected(false);
      eventSource.close();
    };

    // Handle "connect" event
    eventSource.addEventListener("connect", (e) => {
      const data = JSON.parse(e.data);
      console.log("Connected:", data.message);
    });

    // Handle event type "a"
    eventSource.addEventListener("a", (e) => {
      const data = JSON.parse(e.data);
      setEvents((prev) => ({ ...prev, a: data }));
    });

    // Handle event type "b"
    eventSource.addEventListener("b", (e) => {
      const data = JSON.parse(e.data);
      setEvents((prev) => ({ ...prev, b: data }));
    });

    // Handle event type "c"
    eventSource.addEventListener("c", (e) => {
      const data = JSON.parse(e.data);
      setEvents((prev) => ({ ...prev, c: data }));
    });

    // Clean up on component unmount
    return () => {
      eventSource.close();
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
        <EventCard type="a" data={events.a} />
        <EventCard type="b" data={events.b} />
        <EventCard type="c" data={events.c} />
      </div>
    </div>
  );
}

function EventCard({ type, data }: { type: string; data: EventData | null }) {
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
