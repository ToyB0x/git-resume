import { randomUUID } from "node:crypto";
import { vValidator } from "@hono/valibot-validator";
import {
  type ConnectedEventData,
  type CreateSummaryState,
  EventType,
  ResumeEventType,
  type ResumeGenerationState,
} from "@resume/models";
import { gitHubService } from "@resume/services";
import { createFactory } from "hono/factory";
import { type SSEStreamingApi, streamSSE } from "hono/streaming";
import * as v from "valibot";
import { env, sendTypedEvent } from "../../../utils";

const factory = createFactory();

const validator = vValidator(
  "param",
  v.object({
    userName: v.pipe(v.string(), v.minLength(3)),
  }),
);

const handlers = factory.createHandlers(validator, async (c) => {
  const { userName } = c.req.valid("param");

  return streamSSE(
    c,
    async (streamSSE) => {
      streamSSE.onAbort(async () => {
        console.log("Aborted resume generation stream!");
        await streamSSE.close();
      });

      // Connected event
      const connectedData: ConnectedEventData = {
        message: `Connected to resume generation stream for user: ${userName}`,
      };
      await sendTypedEvent(
        streamSSE,
        EventType.CONNECTED,
        connectedData,
        randomUUID(),
      );

      if (userName === "demo") {
        // Simulate the generation process
        await simulateResumeGeneration(streamSSE, userName, true);
      } else {
        // Real response
        await simulateResumeGeneration(streamSSE, userName, false);
      }

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

export const getUserSseHandler = handlers;

/**
 * Simulates generation process with realistic delays and state updates
 */
async function simulateResumeGeneration(
  streamSSE: SSEStreamingApi,
  userName: string,
  isDemo: boolean,
) {
  // Step 1: Git Search
  if (isDemo) {
    // Simulate finding repositories and commits
    for (let i = 0; i < 5; i++) {
      await streamSSE.sleep(1000);
      await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, {
        type: ResumeEventType.GIT_SEARCH,
        foundCommitSize: i * 50,
        foundRepositories: [
          "demo/blog",
          "demo/website",
          "demo/app",
          "demo/cli",
          "demo/mobile",
        ].slice(0, i + 1),
      });
    }
  } else {
    await gitHubService.getUserCommitedRepositories(
      userName,
      true,
      env.GITHUB_TOKEN,
      async (args) =>
        await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, {
          type: ResumeEventType.GIT_SEARCH,
          foundCommitSize: args.commitSize,
          foundRepositories: args.repositories,
        }),
    );
  }

  // search commitsの最後のページネーション結果の表示を待つ
  await streamSSE.sleep(1500);

  // Step 2: Git Clone (3 repositories)
  if (isDemo) {
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

        await sendTypedEvent(
          streamSSE,
          EventType.RESUME_PROGRESS,
          gitCloneState,
        );
      }
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
