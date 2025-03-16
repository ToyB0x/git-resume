/**
 * Shared types for event-driven messages between server and client
 * Includes both SSE (Server-Sent Events) types and state updates for the resume generation process
 */

// ------------------------------------------------------------------------------------
// SSE Events
// ------------------------------------------------------------------------------------

/**
 * Type for the connected event data
 */
export interface ConnectedEventData {
  message: string;
}

/**
 * Enumeration of all supported SSE event types
 * This is exported as a value to allow direct usage in SSE events
 */
export enum EventType {
  CONNECTED = "connected",
  RESUME_PROGRESS = "resume_progress",
}

/**
 * Type mapping SSE event types to their corresponding data types
 */
export interface EventDataMap {
  [EventType.CONNECTED]: ConnectedEventData;
  [EventType.RESUME_PROGRESS]: ResumeGenerationState;
}

/**
 * Union type for all SSE event data
 */
export type EventData = EventDataMap[keyof EventDataMap];

// ------------------------------------------------------------------------------------
// Resume Generation State Events
// ------------------------------------------------------------------------------------

/**
 * Enumeration of all resume generation state event types
 * This allows for a more formalized approach to state events
 */
export enum ResumeEventType {
  GIT_SEARCH = "GitSearch",
  GIT_CLONE = "GitClone",
  ANALYZE = "Analyze",
  CREATE_SUMMARY = "CreateSummary",
  CREATING_RESUME = "CreatingResume",
}

/**
 * Git search commit progress state
 */
export type GitSearchState = {
  type: ResumeEventType.GIT_SEARCH;
  foundCommitSize: number;
  foundRepositories: string[];
};

/**
 * Git clone progress state
 */
export type GitCloneState = {
  type: ResumeEventType.GIT_CLONE;
  repositories: {
    name: string;
    state: "waiting" | "cloning" | "cloned";
    updatedAt: Date;
  }[];
};

/**
 * Repository analysis progress state
 */
export type AnalyzeState = {
  type: ResumeEventType.ANALYZE;
  repositories: {
    name: string;
    state: "waiting" | "analyzing" | "analyzed";
    updatedAt: Date;
  }[];
};

/**
 * Summary creation progress state
 */
export type CreateSummaryState = {
  type: ResumeEventType.CREATE_SUMMARY;
  repositories: {
    name: string;
    state: "waiting" | "summarizing" | "summarized";
    updatedAt: Date;
  }[];
};

/**
 * Resume creation progress state
 */
export type CreatingResumeState = {
  type: ResumeEventType.CREATING_RESUME;
  state: "AI_THINKING" | "AI_DONE";
};

/**
 * Union type of all possible resume generation states
 */
export type ResumeGenerationState =
  | GitSearchState
  | GitCloneState
  | AnalyzeState
  | CreateSummaryState
  | CreatingResumeState;

/**
 * Type mapping resume event types to their corresponding state types
 */
export interface ResumeEventDataMap {
  [ResumeEventType.GIT_SEARCH]: GitSearchState;
  [ResumeEventType.GIT_CLONE]: GitCloneState;
  [ResumeEventType.ANALYZE]: AnalyzeState;
  [ResumeEventType.CREATE_SUMMARY]: CreateSummaryState;
  [ResumeEventType.CREATING_RESUME]: CreatingResumeState;
}
