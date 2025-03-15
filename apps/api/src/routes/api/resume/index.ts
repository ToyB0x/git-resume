import { randomUUID } from "node:crypto";
import {
  type ConnectedEventData,
  type CreateSummaryState,
  type EventDataMap,
  EventType,
  ResumeEventType,
  type ResumeGenerationState,
} from "@resume/models";
import { Hono } from "hono";
import {
  type SSEMessage,
  type SSEStreamingApi,
  streamSSE,
} from "hono/streaming";

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

/**
 * Simulates generation process with realistic delays and state updates
 */
async function simulateResumeGeneration(streamSSE: SSEStreamingApi) {
  // Step 1: Git Search
  const gitSearchState: ResumeGenerationState = {
    type: ResumeEventType.GIT_SEARCH,
    foundCommits: 0,
    foundRepositories: 0,
  };

  await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, gitSearchState);

  // Simulate finding repositories and commits
  for (let i = 0; i < 5; i++) {
    await streamSSE.sleep(1000);
    gitSearchState.foundRepositories = i + 1;
    gitSearchState.foundCommits = (i + 1) * 50;

    await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, gitSearchState);
  }

  // Step 2: Git Clone (3 repositories)
  for (let repoIdx = 0; repoIdx < 3; repoIdx++) {
    const repoName = `user/repo${repoIdx + 1}`;
    const gitCloneState: ResumeGenerationState = {
      type: ResumeEventType.GIT_CLONE,
      repository: repoName,
      current: 0,
      total: 3,
    };

    await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, gitCloneState);

    // Simulate cloning progress
    for (let i = 0; i < 3; i++) {
      await streamSSE.sleep(1000);
      gitCloneState.current = i + 1;

      await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, gitCloneState);
    }
  }

  // Step 3: Analyze repositories
  for (let repoIdx = 0; repoIdx < 3; repoIdx++) {
    const repoName = `user/repo${repoIdx + 1}`;
    const analyzeState: ResumeGenerationState = {
      type: ResumeEventType.ANALYZE,
      repository: repoName,
      current: 0,
      total: 5,
    };

    await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, analyzeState);

    // Simulate analysis progress
    for (let i = 0; i < 5; i++) {
      await streamSSE.sleep(800);
      analyzeState.current = i + 1;

      await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, analyzeState);
    }
  }

  // Step 4: Create summaries
  // Use direct type cast to avoid exactOptionalPropertyTypes issue with repository property
  const summaryState = {
    type: ResumeEventType.CREATE_SUMMARY,
    current: 0,
    total: 5,
  } as CreateSummaryState;

  await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, summaryState);

  // Simulate summary creation progress
  for (let i = 0; i < 5; i++) {
    await streamSSE.sleep(1000);
    summaryState.current = i + 1;

    // For the first 3 iterations, add repository info, or omit it
    if (i < 3) {
      const repoName = `user/repo${i + 1}`;

      // Create a new state object with the repository property for first 3 iterations
      await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, {
        ...summaryState,
        repository: repoName,
      } as CreateSummaryState);
    } else {
      // For last iterations, send state without repository property
      await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, summaryState);
    }

    // We've already sent the event in each condition above
  }

  // Step 5: Create resume
  const resumeState: ResumeGenerationState = {
    type: ResumeEventType.CREATING_RESUME,
  };

  await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, resumeState);

  // Resume creation takes a bit longer
  await streamSSE.sleep(2000);
}

export const resumeRoute = new Hono()
  // SSE endpoint for resume generation progress
  .get("/:userId/progress", async (c) => {
    const userId = c.req.param("userId");

    return streamSSE(
      c,
      async (streamSSE) => {
        streamSSE.onAbort(async () => {
          console.log("Aborted resume generation stream!");
          await streamSSE.close();
        });

        // Connected event
        const connectedData: ConnectedEventData = {
          message: `Connected to resume generation stream for user: ${userId}`,
        };
        await sendTypedEvent(
          streamSSE,
          EventType.CONNECTED,
          connectedData,
          randomUUID(),
        );

        // Simulate the generation process
        await simulateResumeGeneration(streamSSE);

        // Add a short delay before closing
        await streamSSE.sleep(500);
        await streamSSE.close();
      },
      async (err, streamSSE) => {
        console.error("Error in resume generation stream:", err);
        await streamSSE.writeln("An error occurred in resume generation!");
        await streamSSE.close();
      },
    );
  });
