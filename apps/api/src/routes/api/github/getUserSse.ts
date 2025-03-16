import { randomUUID } from "node:crypto";
import { vValidator } from "@hono/valibot-validator";
import {
  type AnalyzeState,
  type ConnectedEventData,
  type CreateSummaryState,
  EventType,
  type GitCloneState,
  ResumeEventType,
  type ResumeGenerationState,
} from "@resume/models";
import {
  gitHubService,
  gitService,
  packService,
  summaryService,
} from "@resume/services";
import { PromisePool } from "@supercharge/promise-pool";
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
  const demoRepositories = [
    "demo/blog",
    "demo/website",
    "demo/app",
    "demo/api",
    "demo/cli",
    "demo/mobile",
    "demo/desktop",
    "demo/library",
  ];

  // Step 1: Git Search
  const repositories = [];
  if (isDemo) {
    // Simulate finding repositories and commits
    for (let i = 0; i < 5; i++) {
      await streamSSE.sleep(300);
      await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, {
        type: ResumeEventType.GIT_SEARCH,
        foundCommitSize: i * 50,
        foundRepositories: demoRepositories.slice(0, i + 1),
      });
    }
  } else {
    repositories.push(
      ...(await gitHubService.getUserCommitedRepositories(
        userName,
        true,
        env.GITHUB_TOKEN,
        async (args) =>
          await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, {
            type: ResumeEventType.GIT_SEARCH,
            foundCommitSize: args.commitSize,
            foundRepositories: args.repositories,
          }),
      )),
    );
  }

  // Step 2: Git Clone (3 repositories)
  if (isDemo) {
    // init state
    let gitCloneState: GitCloneState = {
      type: ResumeEventType.GIT_CLONE,
      repositories: demoRepositories.map((repo) => ({
        name: repo,
        state: "waiting",
        updatedAt: new Date(),
      })),
    };

    for (let i = 0; i < demoRepositories.length; i++) {
      // update and send ongoing state
      gitCloneState = {
        ...gitCloneState,
        repositories: gitCloneState.repositories.map((r) => ({
          ...r,
          state: r.name === demoRepositories[i] ? "cloned" : r.state,
          updatedAt: r.name === demoRepositories[i] ? new Date() : r.updatedAt,
        })),
      };

      await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, gitCloneState);
      await streamSSE.sleep(300);
    }
  } else {
    // send init state
    let gitCloneState: GitCloneState = {
      type: ResumeEventType.GIT_CLONE,
      repositories: repositories.map((repo) => ({
        name: `${repo.owner}/${repo.name}`,
        state: "waiting",
        updatedAt: new Date(),
      })),
    };
    await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, gitCloneState);

    const { errors } = await PromisePool.for(repositories)
      .withConcurrency(3)
      .process(async (repo) => {
        // update and send ongoing state
        gitCloneState = {
          ...gitCloneState,
          repositories: gitCloneState.repositories.map((r) => ({
            ...r,
            state:
              r.name === `${repo.owner}/${repo.name}` ? "cloning" : r.state,
            updatedAt:
              r.name === `${repo.owner}/${repo.name}`
                ? new Date()
                : r.updatedAt,
          })),
        };
        await sendTypedEvent(
          streamSSE,
          EventType.RESUME_PROGRESS,
          gitCloneState,
        );

        // clone or pull repository
        await gitService.cloneOrPullRepository(repo);

        // update and send completed state
        gitCloneState = {
          ...gitCloneState,
          repositories: gitCloneState.repositories.map((r) => ({
            ...r,
            state: r.name === `${repo.owner}/${repo.name}` ? "cloned" : r.state,
            updatedAt:
              r.name === `${repo.owner}/${repo.name}`
                ? new Date()
                : r.updatedAt,
          })),
        };

        await sendTypedEvent(
          streamSSE,
          EventType.RESUME_PROGRESS,
          gitCloneState,
        );
      });
    console.error(errors);
  }

  // Step 3: Analyze repositories
  if (isDemo) {
    // init state
    let gitAnalyzeState: AnalyzeState = {
      type: ResumeEventType.ANALYZE,
      repositories: demoRepositories.map((repo) => ({
        name: repo,
        state: "waiting",
        updatedAt: new Date(),
      })),
    };

    for (let i = 0; i < demoRepositories.length; i++) {
      // update and send ongoing state
      gitAnalyzeState = {
        ...gitAnalyzeState,
        repositories: gitAnalyzeState.repositories.map((r) => ({
          ...r,
          state: r.name === demoRepositories[i] ? "analyzed" : r.state,
          updatedAt: r.name === demoRepositories[i] ? new Date() : r.updatedAt,
        })),
      };

      await sendTypedEvent(
        streamSSE,
        EventType.RESUME_PROGRESS,
        gitAnalyzeState,
      );
      await streamSSE.sleep(300);
    }
  } else {
    // send init state
    let analyzeState: AnalyzeState = {
      type: ResumeEventType.ANALYZE,
      repositories: repositories.map((repo) => ({
        name: `${repo.owner}/${repo.name}`,
        state: "waiting",
        updatedAt: new Date(),
      })),
    };
    await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, analyzeState);

    const { errors } = await PromisePool.for(repositories)
      .withConcurrency(3)
      .process(async (repo) => {
        // update and send ongoing state
        analyzeState = {
          ...analyzeState,
          repositories: analyzeState.repositories.map((r) => ({
            ...r,
            state:
              r.name === `${repo.owner}/${repo.name}` ? "analyzing" : r.state,
            updatedAt:
              r.name === `${repo.owner}/${repo.name}`
                ? new Date()
                : r.updatedAt,
          })),
        };
        await sendTypedEvent(
          streamSSE,
          EventType.RESUME_PROGRESS,
          analyzeState,
        );

        const gitRepoDir = `./generated/git/${repo.owner}/${repo.name}`;
        await packService.create(userName, gitRepoDir);

        // update and send completed state
        analyzeState = {
          ...analyzeState,
          repositories: analyzeState.repositories.map((r) => ({
            ...r,
            state:
              r.name === `${repo.owner}/${repo.name}` ? "analyzed" : r.state,
            updatedAt:
              r.name === `${repo.owner}/${repo.name}`
                ? new Date()
                : r.updatedAt,
          })),
        };

        await sendTypedEvent(
          streamSSE,
          EventType.RESUME_PROGRESS,
          analyzeState,
        );
      });
    console.error(errors);
  }

  // Step 4: Create summaries
  // Use direct type cast to avoid exactOptionalPropertyTypes issue with repository property
  if (isDemo) {
    // init state
    let summaryState: CreateSummaryState = {
      type: ResumeEventType.CREATE_SUMMARY,
      repositories: demoRepositories.map((repo) => ({
        name: repo,
        state: "waiting",
        updatedAt: new Date(),
      })),
    };

    for (let i = 0; i < demoRepositories.length; i++) {
      // update and send ongoing state
      summaryState = {
        ...summaryState,
        repositories: summaryState.repositories.map((r) => ({
          ...r,
          state: r.name === demoRepositories[i] ? "summarized" : r.state,
          updatedAt: r.name === demoRepositories[i] ? new Date() : r.updatedAt,
        })),
      };

      await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, summaryState);
      await streamSSE.sleep(300);
    }
  } else {
    const packs = await packService.load(userName);

    // send init state
    let summaryState: CreateSummaryState = {
      type: ResumeEventType.CREATE_SUMMARY,
      repositories: packs.map(({ meta }) => ({
        name: `${meta.owner}/${meta.repo}`,
        state: "waiting",
        updatedAt: new Date(),
      })),
    };
    await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, summaryState);

    const { errors } = await PromisePool.for(packs)
      .withConcurrency(3)
      .process(async (pack) => {
        // update and send ongoing state
        summaryState = {
          ...summaryState,
          repositories: summaryState.repositories.map((r) => ({
            ...r,
            state:
              r.name === `${pack.meta.owner}/${pack.meta.repo}`
                ? "summarizing"
                : r.state,
            updatedAt:
              r.name === `${pack.meta.owner}/${pack.meta.repo}`
                ? new Date()
                : r.updatedAt,
          })),
        };
        await sendTypedEvent(
          streamSSE,
          EventType.RESUME_PROGRESS,
          summaryState,
        );

        await summaryService.create(userName, pack, env.RESUME_GEMINI_API_KEY);

        // update and send completed state
        summaryState = {
          ...summaryState,
          repositories: summaryState.repositories.map((r) => ({
            ...r,
            state:
              r.name === `${pack.meta.owner}/${pack.meta.repo}`
                ? "summarized"
                : r.state,
            updatedAt:
              r.name === `${pack.meta.owner}/${pack.meta.repo}`
                ? new Date()
                : r.updatedAt,
          })),
        };

        await sendTypedEvent(
          streamSSE,
          EventType.RESUME_PROGRESS,
          summaryState,
        );
      });
    console.error(errors);
  }

  // Step 5: Create resume
  const resumeState: ResumeGenerationState = {
    type: ResumeEventType.CREATING_RESUME,
    state: "AI_THINKING",
  };
  await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, resumeState);

  if (isDemo) {
    // Resume creation takes a bit longer
    await streamSSE.sleep(2000);
    resumeState.state = "AI_DONE";
    await sendTypedEvent(streamSSE, EventType.RESUME_PROGRESS, resumeState);
  }
}
