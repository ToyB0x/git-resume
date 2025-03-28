import { fetchEventSource } from "@microsoft/fetch-event-source";
import type { ResumeGenerationState } from "@resume/models";
import { EventType, ResumeEventType } from "@resume/models";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import type { Route } from "./+types/github.$userId";

// biome-ignore lint/correctness/noEmptyPattern: template default
export function meta({}: Route.MetaArgs) {
  return [
    { title: "GitHub Resume" },
    { name: "description", content: "View GitHub user resume" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const userId = params.userId;

  // const userResponse = await hClient.api.github[":userName"].$get({
  //   param: {
  //     userName: userId,
  //   },
  // });
  //
  // if (!userResponse.ok) throw Error("Failed to fetch user data");
  //
  // const { markdown } = await userResponse.json();
  //
  // // Strip frontmatter if present
  // const content = stripFrontmatter(markdown);

  return {
    userId,
    // markdown: content,
  };
}

// Real-time state update component using SSE
function LoadingStates({
  userId,
}: {
  userId: string;
}) {
  const [currentState, setCurrentState] = useState<ResumeGenerationState>({
    type: ResumeEventType.GIT_SEARCH,
    foundCommitSize: 0,
    foundRepositories: [],
  });

  useEffect(() => {
    const abortController = new AbortController();
    let retryCount = 0;
    const MAX_RETRIES = 5;

    const connectToEventSource = async () => {
      try {
        // Use relative URL to avoid hardcoded localhost in production
        await fetchEventSource(
          `http://localhost:3000/api/github/${userId}/progress`,
          {
            signal: abortController.signal,

            onopen: async (response) => {
              if (response.ok) {
                retryCount = 0;
                console.log("Connected to resume progress stream");
              } else {
                const error = await response.text();
                console.error(`Failed to connect to progress stream: ${error}`);
                throw new Error(
                  `Failed to connect: ${response.status} ${error}`,
                );
              }
            },

            onmessage: (event) => {
              const { event: eventTypeStr, data } = event;
              const parsedData = JSON.parse(data);

              console.log({ eventTypeStr, data });

              // Handle resume progress events
              if (eventTypeStr === EventType.RESUME_PROGRESS) {
                const newState = parsedData as ResumeGenerationState;
                setCurrentState(newState);
              } else if (eventTypeStr === EventType.CONNECTED) {
                console.log("Connected:", parsedData.message);
              }
            },

            onerror: (err) => {
              console.error("EventSource error:", err);
              retryCount++;
              if (retryCount > MAX_RETRIES) {
                console.error(`Max retries (${MAX_RETRIES}) reached`);
                abortController.abort();
                return;
              }

              // Allow the fetchEventSource to retry automatically
              return;
            },

            onclose: () => {
              console.log("Resume progress stream closed");
            },
          },
        );
      } catch (err) {
        console.error("Error connecting to event source:", err);
      }
    };

    connectToEventSource();

    // Clean up on component unmount
    return () => {
      abortController.abort();
    };
  }, [userId]); // Only depend on userId to prevent reconnection when state changes

  // Get status indicator based on state type - using modern SVG icons
  const getStateIndicator = (
    stateType: ResumeEventType,
    currentState: ResumeEventType,
    isCurrent: boolean,
  ) => {
    // Check if we have completed the full process before closing the connection
    const allStates = [
      ResumeEventType.GIT_SEARCH,
      ResumeEventType.GIT_CLONE,
      ResumeEventType.ANALYZE,
      ResumeEventType.CREATE_SUMMARY,
      ResumeEventType.CREATING_RESUME,
      ResumeEventType.COMPLETE,
    ];
    const selfStateIndex =
      allStates.findIndex((state) => state === stateType) ?? 0;
    const currentStateIndex =
      allStates.findIndex((state) => state === currentState) ?? 0;
    const isCompleted = selfStateIndex < currentStateIndex;

    const stateConfig = {
      [ResumeEventType.GIT_SEARCH]: {
        color: "text-blue-500",
        fillColor: "fill-blue-500",
        strokeColor: "stroke-blue-500",
        label: "Search",
      },
      [ResumeEventType.GIT_CLONE]: {
        color: "text-indigo-500",
        fillColor: "fill-indigo-500",
        strokeColor: "stroke-indigo-500",
        label: "Clone",
      },
      [ResumeEventType.ANALYZE]: {
        color: "text-purple-500",
        fillColor: "fill-purple-500",
        strokeColor: "stroke-purple-500",
        label: "Analyze",
      },
      [ResumeEventType.CREATE_SUMMARY]: {
        color: "text-cyan-500",
        fillColor: "fill-cyan-500",
        strokeColor: "stroke-cyan-500",
        label: "Summarize",
      },
      [ResumeEventType.CREATING_RESUME]: {
        color: "text-emerald-500",
        fillColor: "fill-emerald-500",
        strokeColor: "stroke-emerald-500",
        label: "Generate",
      },
      [ResumeEventType.COMPLETE]: {
        color: "text-green-500",
        fillColor: "fill-green-500",
        strokeColor: "stroke-green-500",
        label: "Complete",
      },
    };

    const config = stateConfig[stateType];

    // Completed status - check mark in a circle
    if (isCompleted) {
      return (
        <div className="flex flex-col items-center group">
          <div className="mb-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label={`Completed: ${config.label}`}
            >
              <title>{`Completed: ${config.label}`}</title>　
              <path
                d="M8 12L11 15L16 9"
                className={`${config.strokeColor}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className={`text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        </div>
      );
    }

    if (isCurrent) {
      return (
        <div className="flex flex-col items-center group">
          <div className="mb-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-pulse"
              role="img"
              aria-label={`In progress: ${config.label}`}
            >
              <title>{`In progress: ${config.label}`}</title>
              <circle
                cx="12"
                cy="12"
                r="10"
                className={`${config.fillColor} opacity-20`}
              />
              <circle
                cx="12"
                cy="12"
                r="5"
                className={`${config.fillColor} opacity-40`}
              />
              <circle cx="12" cy="12" r="2" className={`${config.fillColor}`} />
            </svg>
          </div>
          <span className={`text-xs font-semibold ${config.color}`}>
            {config.label}
          </span>
        </div>
      );
    }

    // Pending status - empty circle
    return (
      <div className="flex flex-col items-center group">
        <div className="mb-2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={`Pending: ${config.label}`}
          >
            <title>{`Pending: ${config.label}`}</title>
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              className="text-gray-700"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
          </svg>
        </div>
        <span className="text-xs text-gray-500">{config.label}</span>
      </div>
    );
  };

  // Render different UI based on state type
  const renderStateUI = () => {
    if (currentState.type === "Complete") {
      return (
        /* Resume Content (Markdown) - Only shown after generation complete */
        <div className="markdown-content bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div className="prose prose-invert max-w-none text-gray-200">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-3xl font-bold text-white mt-10 mb-6"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-2xl font-semibold text-gray-100 mt-10 mb-5 border-b border-gray-700 pb-4"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-xl font-semibold text-gray-200 mt-7 mb-4"
                    {...props}
                  />
                ),
                h4: ({ node, ...props }) => (
                  <h4
                    className="text-lg font-semibold text-gray-300 mt-5 mb-3"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-gray-300 my-3" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul
                    className="text-gray-300 list-disc pl-5 my-3"
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className="text-gray-300 list-decimal pl-5 my-3"
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-gray-300 ml-2 my-1" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-blue-400 hover:text-blue-300 underline"
                    {...props}
                  />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-purple-500 pl-4 italic text-gray-300 my-4"
                    {...props}
                  />
                ),
                code: ({ node, ...props }) => (
                  <code
                    className="bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded text-sm"
                    {...props}
                  />
                ),
                pre: ({ node, ...props }) => (
                  <pre
                    className="bg-gray-900 text-gray-200 p-3 rounded text-sm overflow-x-auto my-4"
                    {...props}
                  />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="text-white font-bold" {...props} />
                ),
                table: ({ node, ...props }) => (
                  <table
                    className="border-collapse table-auto w-full text-sm my-4"
                    {...props}
                  />
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="border-b border-gray-600 p-2 text-left text-gray-200 font-medium"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className="border-b border-gray-700 p-2 text-gray-300"
                    {...props}
                  />
                ),
              }}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {currentState.markdown}
            </ReactMarkdown>
          </div>
        </div>
      );
    }

    // Show progress stages with detailed information
    return (
      <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Progress steps visualization */}
        <div className="flex items-center justify-center mb-10 mt-4 w-full max-w-2xl relative">
          {/* Connecting lines between steps - SVG Edition */}
          <div className="absolute h-px bg-gray-800 top-14 left-[10%] right-[10%] z-0" />

          {/* Step indicators - modern minimal design */}
          <div className="grid grid-cols-5 w-full relative z-10">
            <div className="flex flex-col items-center">
              {getStateIndicator(
                ResumeEventType.GIT_SEARCH,
                currentState.type,
                currentState.type === ResumeEventType.GIT_SEARCH,
              )}
            </div>
            <div className="flex flex-col items-center">
              {getStateIndicator(
                ResumeEventType.GIT_CLONE,
                currentState.type,
                currentState.type === ResumeEventType.GIT_CLONE,
              )}
            </div>
            <div className="flex flex-col items-center">
              {getStateIndicator(
                ResumeEventType.ANALYZE,
                currentState.type,
                currentState.type === ResumeEventType.ANALYZE,
              )}
            </div>
            <div className="flex flex-col items-center">
              {getStateIndicator(
                ResumeEventType.CREATE_SUMMARY,
                currentState.type,
                currentState.type === ResumeEventType.CREATE_SUMMARY,
              )}
            </div>
            <div className="flex flex-col items-center">
              {getStateIndicator(
                ResumeEventType.CREATING_RESUME,
                currentState.type,
                currentState.type === ResumeEventType.CREATING_RESUME,
              )}
            </div>
          </div>
        </div>

        {/* Current state details */}
        <div className="h-56 bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800 w-full max-w-lg relative">
          {currentState.type === ResumeEventType.GIT_SEARCH && (
            <div className="text-center">
              <div className="text-xl mb-4 text-blue-400 font-semibold">
                Searching GitHub repositories
              </div>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Commits found:</span>
                  <span className="font-mono px-2 py-1 rounded">
                    {currentState.foundCommitSize}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Repositories found:</span>
                  <span className="font-mono px-2 py-1 rounded">
                    {currentState.foundRepositories.length}
                  </span>
                </div>
                <div className="text-right text-sm text-gray-400 truncate w-full h-6">
                  {currentState.foundRepositories.length
                    ? currentState.foundRepositories.join(", ")
                    : ""}
                </div>
              </div>
            </div>
          )}

          {currentState.type === ResumeEventType.GIT_CLONE && (
            <div className="h-56 text-center">
              <div className="text-xl mb-4 text-indigo-400 font-semibold">
                Cloning repositories
              </div>
              <div className="space-y-3 text-gray-300">
                {currentState.repositories
                  // .filter((repo) => repo.state === "cloning")
                  .sort(
                    (a, b) =>
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime(),
                  )
                  .slice(0, 3)
                  .map((repo) => (
                    <div
                      key={repo.name}
                      className="flex justify-between items-center overflow-hidden"
                    >
                      <span className="font-mono px-2 py-1 rounded text-sm truncate max-w-[70%] text-left">
                        {repo.name}
                      </span>
                      <span className="text-xs italic px-2 py-1 rounded">
                        {repo.state === "cloning"
                          ? `...${repo.state}`
                          : repo.state}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="w-full h-1 mt-4 px-2 overflow-hidden bg-gray-800 rounded">
                {(() => {
                  const clonedCount = currentState.repositories.filter(
                    (repo) => repo.state === "cloned",
                  ).length;
                  const totalCount = currentState.repositories.length;
                  const progress = (clonedCount / totalCount) * 100;
                  return (
                    <div
                      className="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                      style={{
                        width: `${progress}%`,
                        backgroundSize: "200% 100%",
                        backgroundPosition: `${progress}% 0`,
                      }}
                    />
                  );
                })()}
              </div>
            </div>
          )}

          {currentState.type === ResumeEventType.ANALYZE && (
            <div className="h-56 text-center">
              <div className="text-xl mb-4 text-indigo-400 font-semibold">
                Analyzing repositories
              </div>
              <div className="space-y-3 text-gray-300">
                {currentState.repositories
                  // .filter((repo) => repo.state === "cloning")
                  .sort(
                    (a, b) =>
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime(),
                  )
                  .slice(0, 3)
                  .map((repo) => (
                    <div
                      key={repo.name}
                      className="flex justify-between items-center overflow-hidden"
                    >
                      <span className="font-mono px-2 py-1 rounded text-sm truncate max-w-[70%] text-left">
                        {repo.name}
                      </span>
                      <span className="text-xs italic px-2 py-1 rounded">
                        {repo.state === "analyzing"
                          ? `...${repo.state}`
                          : repo.state}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="w-full h-1 mt-4 px-2 overflow-hidden bg-gray-800 rounded">
                {(() => {
                  const clonedCount = currentState.repositories.filter(
                    (repo) => repo.state === "analyzed",
                  ).length;
                  const totalCount = currentState.repositories.length;
                  const progress = (clonedCount / totalCount) * 100;
                  return (
                    <div
                      className="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                      style={{
                        width: `${progress}%`,
                        backgroundSize: "200% 100%",
                        backgroundPosition: `${progress}% 0`,
                      }}
                    />
                  );
                })()}
              </div>
            </div>
          )}

          {currentState.type === ResumeEventType.CREATE_SUMMARY && (
            <div className="h-56 text-center">
              <div className="text-xl mb-4 text-indigo-400 font-semibold">
                Creating summary for each repository
              </div>
              <div className="space-y-3 text-gray-300">
                {currentState.repositories
                  // .filter((repo) => repo.state === "cloning")
                  .sort(
                    (a, b) =>
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime(),
                  )
                  .slice(0, 3)
                  .map((repo) => (
                    <div
                      key={repo.name}
                      className="flex justify-between items-center overflow-hidden"
                    >
                      <span className="font-mono px-2 py-1 rounded text-sm truncate max-w-[70%] text-left">
                        {repo.name}
                      </span>
                      <span className="text-xs italic px-2 py-1 rounded">
                        {repo.state === "summarizing"
                          ? `...${repo.state}`
                          : repo.state}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="w-full h-1 mt-4 px-2 overflow-hidden bg-gray-800 rounded">
                {(() => {
                  const clonedCount = currentState.repositories.filter(
                    (repo) => repo.state === "summarized",
                  ).length;
                  const totalCount = currentState.repositories.length;
                  const progress = (clonedCount / totalCount) * 100;
                  return (
                    <div
                      className="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                      style={{
                        width: `${progress}%`,
                        backgroundSize: "200% 100%",
                        backgroundPosition: `${progress}% 0`,
                      }}
                    />
                  );
                })()}
              </div>
            </div>
          )}

          {currentState.type === ResumeEventType.CREATING_RESUME && (
            <div className="h-56 text-center">
              <div className="text-xl mb-4 font-light text-white">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                  AI Generating
                </span>{" "}
                {userId}'s Resume
              </div>
              <div className="inline-flex items-center mt-8 text-gray-300">
                TIPS: Get more detailed analysis with Pro plan
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return <div className="w-full max-w-3xl mx-auto">{renderStateUI()}</div>;
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { userId } = loaderData;

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 relative overflow-hidden p-4">
      <div className="relative bg-black/60 backdrop-blur-sm border border-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-8 z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            GitHub Resume
          </h1>
          <p className="text-gray-300 mt-3">
            Profile generated from GitHub activity
          </p>
        </header>

        <div className="flex items-center justify-center min-h-[60vh]">
          {/* Full-screen loading experience while generating */}
          <LoadingStates userId={userId} />
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mt-10 rounded-full" />
        <footer className="text-center text-gray-400 text-xs mt-6">
          Built with GitHub data and AI generation
        </footer>
      </div>
    </main>
  );
}
