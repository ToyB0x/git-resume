/**
 * Shared types for SSE (Server-Sent Events) between API and client
 */

/**
 * Type for the connected event data
 */
export interface ConnectedEventData {
  message: string;
}

/**
 * Type for the value events (a, b, c)
 */
export interface ValueEventData {
  value: string;
}

/**
 * Enumeration of all supported event types
 * This is exported as a value to allow direct usage in SSE events
 */
export enum EventType {
  CONNECTED = "connected",
  A = "a",
  B = "b",
  C = "c",
}

/**
 * Type mapping event types to their corresponding data types
 */
export interface EventDataMap {
  [EventType.CONNECTED]: ConnectedEventData;
  [EventType.A]: ValueEventData;
  [EventType.B]: ValueEventData;
  [EventType.C]: ValueEventData;
}

/**
 * Union type for all event data
 */
export type EventData = EventDataMap[keyof EventDataMap];
