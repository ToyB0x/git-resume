import { fetchEventSource } from "@microsoft/fetch-event-source";
import type { ResumeGenerationState } from "@resume/models";
import { EventType, ResumeEventType } from "@resume/models";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { hClient } from "~/clients";
import type { Route } from "./+types/github.$userId";

// biome-ignore lint/correctness/noEmptyPattern: template default
export function meta({}: Route.MetaArgs) {
  return [
    { title: "GitHub Resume" },
    { name: "description", content: "View GitHub user resume" },
  ];
}

// Strip frontmatter from markdown content
function stripFrontmatter(text: string): string {
  // Frontmatter must start at the very beginning of the document
  // This regex specifically matches frontmatter at the start of the document
  // followed by two or more hyphens on their own line
  const frontmatterRegex = /^\s*---\s*\n([\s\S]*?)\n\s*---\s*\n/;
  const match = text.match(frontmatterRegex);

  if (match) {
    // Return everything after the frontmatter block
    return text.substring(match[0].length).trim();
  }

  return text;
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const userId = params.userId;

  const userResponse = await hClient.api.github[":userName"].$get({
    param: {
      userName: userId,
    },
  });

  if (!userResponse.ok) throw Error("Failed to fetch user data");

  const { markdown } = await userResponse.json();

  // Strip frontmatter if present
  const content = stripFrontmatter(markdown);

  return {
    userId,
    markdown: content,
  };
}

// Real-time state update component using SSE
function LoadingStates({
  userId,
  onComplete,
}: {
  userId: string;
  onComplete: () => void;
}) {
  const [currentState, setCurrentState] = useState<ResumeGenerationState>({
    type: ResumeEventType.GIT_SEARCH,
    foundCommits: 0,
    foundRepositories: 0,
  });
  const [isComplete, setIsComplete] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [completedStates, setCompletedStates] = useState<ResumeEventType[]>([]);

  // Add a state transition animation
  const [animation, setAnimation] = useState<{
    active: boolean;
    from: ResumeEventType;
    to: ResumeEventType;
  } | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    let retryCount = 0;
    const MAX_RETRIES = 5;

    const connectToEventSource = async () => {
      try {
        await fetchEventSource(
          `http://localhost:3000/api/resume/${userId}/progress`,
          {
            signal: abortController.signal,

            onopen: async (response) => {
              if (response.ok) {
                setIsConnected(true);
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

              // Handle resume progress events
              if (eventTypeStr === EventType.RESUME_PROGRESS) {
                const newState = parsedData as ResumeGenerationState;

                // If state type changed, trigger animation
                if (currentState.type !== newState.type) {
                  // First add the previous state to completed states
                  if (!completedStates.includes(currentState.type)) {
                    setCompletedStates((prev) => [...prev, currentState.type]);
                  }

                  // Then animate the transition
                  setAnimation({
                    active: true,
                    from: currentState.type,
                    to: newState.type,
                  });

                  // Reset animation after 1 second
                  setTimeout(() => {
                    setAnimation(null);
                  }, 1000);
                }

                setCurrentState(newState);
              } else if (eventTypeStr === EventType.CONNECTED) {
                console.log("Connected:", parsedData.message);
              }
            },

            onerror: (err) => {
              console.error("EventSource error:", err);
              setIsConnected(false);

              retryCount++;
              if (retryCount > MAX_RETRIES) {
                console.error(`Max retries (${MAX_RETRIES}) reached`);
                // Fall back to static display if connection fails
                setIsComplete(true);
                handleComplete();
                abortController.abort();
                return;
              }

              // Allow the fetchEventSource to retry automatically
              return;
            },

            onclose: () => {
              console.log("Resume progress stream closed");
              setIsConnected(false);
              setIsComplete(true);
              handleComplete();
            },
          },
        );
      } catch (err) {
        console.error("Error connecting to event source:", err);
        setIsConnected(false);
        setIsComplete(true);
        handleComplete();
      }
    };

    connectToEventSource();

    // Clean up on component unmount
    return () => {
      abortController.abort();
    };
  }, [userId, completedStates, currentState.type]);

  // Handle completion after a slight delay for better UX
  const handleComplete = () => {
    // Add a small delay to show completion animation before switching to markdown
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 1500);
  };

  // Get status icon and color based on state type
  const getStateIcon = (stateType: ResumeEventType, isCurrent: boolean) => {
    const isCompleted = completedStates.includes(stateType);

    const stateConfig = {
      [ResumeEventType.GIT_SEARCH]: {
        icon: "🔍",
        color: "text-blue-400",
        bgColor: "bg-blue-500",
      },
      [ResumeEventType.GIT_CLONE]: {
        icon: "📥",
        color: "text-indigo-400",
        bgColor: "bg-indigo-500",
      },
      [ResumeEventType.ANALYZE]: {
        icon: "🔎",
        color: "text-purple-400",
        bgColor: "bg-purple-500",
      },
      [ResumeEventType.CREATE_SUMMARY]: {
        icon: "📝",
        color: "text-cyan-400",
        bgColor: "bg-cyan-500",
      },
      [ResumeEventType.CREATING_RESUME]: {
        icon: "📄",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500",
      },
    };

    const config = stateConfig[stateType];

    if (isCompleted) {
      return (
        <div
          className={`h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center ${config.color} transition-all duration-300`}
        >
          <span className="text-lg">✓</span>
        </div>
      );
    }
    if (isCurrent) {
      return (
        <div
          className={`relative h-10 w-10 rounded-full flex items-center justify-center ${config.bgColor} animate-pulse transition-all duration-300`}
        >
          <span className="text-lg">{config.icon}</span>
          <div className="absolute inset-0 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        </div>
      );
    }
    return (
      <div className="h-10 w-10 rounded-full bg-gray-800 text-gray-600 flex items-center justify-center opacity-50 transition-all duration-300">
        <span className="text-lg">{config.icon}</span>
      </div>
    );
  };

  // Render different UI based on state type
  const renderStateUI = () => {
    if (isComplete) {
      return (
        <div className="animate-in fade-in duration-500 text-center text-green-400 mt-8">
          <div className="text-2xl mb-4">✓ Resume Generation Complete!</div>
          <div className="text-lg text-gray-300">
            Your personalized GitHub resume is ready
          </div>
          <div className="mt-6 text-sm text-gray-400">
            Loading your resume...
          </div>
        </div>
      );
    }

    // When not connected yet, show connecting message
    if (!isConnected) {
      return (
        <div className="text-center text-yellow-400 animate-pulse">
          <div className="text-2xl mb-4">Connecting to resume generator...</div>
          <div className="text-lg text-gray-300">
            Please wait while we establish connection
          </div>
        </div>
      );
    }

    // Show progress stages with detailed information
    return (
      <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Progress steps visualization */}
        <div className="flex items-center justify-center mb-10 mt-4 w-full max-w-2xl relative">
          {/* Connecting lines between steps */}
          <div className="absolute h-1 bg-gray-700 top-5 left-0 right-0 z-0" />

          {/* Step indicators */}
          <div className="grid grid-cols-5 w-full relative z-10">
            <div className="flex flex-col items-center">
              {getStateIcon(
                ResumeEventType.GIT_SEARCH,
                currentState.type === ResumeEventType.GIT_SEARCH,
              )}
              <span
                className={`mt-2 text-xs ${currentState.type === ResumeEventType.GIT_SEARCH ? "text-blue-400 font-bold" : "text-gray-500"}`}
              >
                Search
              </span>
            </div>
            <div className="flex flex-col items-center">
              {getStateIcon(
                ResumeEventType.GIT_CLONE,
                currentState.type === ResumeEventType.GIT_CLONE,
              )}
              <span
                className={`mt-2 text-xs ${currentState.type === ResumeEventType.GIT_CLONE ? "text-indigo-400 font-bold" : "text-gray-500"}`}
              >
                Clone
              </span>
            </div>
            <div className="flex flex-col items-center">
              {getStateIcon(
                ResumeEventType.ANALYZE,
                currentState.type === ResumeEventType.ANALYZE,
              )}
              <span
                className={`mt-2 text-xs ${currentState.type === ResumeEventType.ANALYZE ? "text-purple-400 font-bold" : "text-gray-500"}`}
              >
                Analyze
              </span>
            </div>
            <div className="flex flex-col items-center">
              {getStateIcon(
                ResumeEventType.CREATE_SUMMARY,
                currentState.type === ResumeEventType.CREATE_SUMMARY,
              )}
              <span
                className={`mt-2 text-xs ${currentState.type === ResumeEventType.CREATE_SUMMARY ? "text-cyan-400 font-bold" : "text-gray-500"}`}
              >
                Summarize
              </span>
            </div>
            <div className="flex flex-col items-center">
              {getStateIcon(
                ResumeEventType.CREATING_RESUME,
                currentState.type === ResumeEventType.CREATING_RESUME,
              )}
              <span
                className={`mt-2 text-xs ${currentState.type === ResumeEventType.CREATING_RESUME ? "text-emerald-400 font-bold" : "text-gray-500"}`}
              >
                Generate
              </span>
            </div>
          </div>
        </div>

        {/* Current state details */}
        <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800 w-full max-w-lg animate-in fade-in duration-500 relative">
          {animation && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse rounded-lg" />
          )}

          {currentState.type === ResumeEventType.GIT_SEARCH && (
            <div className="text-center">
              <div className="text-xl mb-4 text-blue-400 font-semibold">
                Searching GitHub repositories
              </div>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Commits found:</span>
                  <span className="font-mono bg-blue-900/30 px-2 py-1 rounded">
                    {currentState.foundCommits || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Repositories found:</span>
                  <span className="font-mono bg-blue-900/30 px-2 py-1 rounded">
                    {currentState.foundRepositories || 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          {currentState.type === ResumeEventType.GIT_CLONE && (
            <div className="text-center">
              <div className="text-xl mb-4 text-indigo-400 font-semibold">
                Cloning repositories
              </div>
              <div className="space-y-3 text-gray-300">
                <div className="overflow-hidden text-ellipsis">
                  <span className="font-mono bg-indigo-900/30 px-2 py-1 rounded text-sm">
                    {currentState.repository}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 mt-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${(currentState.current / currentState.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-right text-sm text-gray-400">
                  {currentState.current}/{currentState.total} repositories
                </div>
              </div>
            </div>
          )}

          {currentState.type === ResumeEventType.ANALYZE && (
            <div className="text-center">
              <div className="text-xl mb-4 text-purple-400 font-semibold">
                Analyzing repository content
              </div>
              <div className="space-y-3 text-gray-300">
                <div className="overflow-hidden text-ellipsis">
                  <span className="font-mono bg-purple-900/30 px-2 py-1 rounded text-sm">
                    {currentState.repository}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 mt-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${(currentState.current / currentState.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-right text-sm text-gray-400">
                  {currentState.current}/{currentState.total} files
                </div>
              </div>
            </div>
          )}

          {currentState.type === ResumeEventType.CREATE_SUMMARY && (
            <div className="text-center">
              <div className="text-xl mb-4 text-cyan-400 font-semibold">
                Creating summaries
              </div>
              <div className="space-y-3 text-gray-300">
                {currentState.repository && (
                  <div className="overflow-hidden text-ellipsis">
                    <span className="font-mono bg-cyan-900/30 px-2 py-1 rounded text-sm">
                      {currentState.repository}
                    </span>
                  </div>
                )}
                <div className="w-full bg-gray-800 rounded-full h-3 mt-2 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${(currentState.current / currentState.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-right text-sm text-gray-400">
                  {currentState.current}/{currentState.total} repositories
                </div>
              </div>
            </div>
          )}

          {currentState.type === ResumeEventType.CREATING_RESUME && (
            <div className="text-center">
              <div className="text-xl mb-4 text-emerald-400 font-semibold">
                Generating final resume
              </div>
              <div className="flex justify-center space-x-1 text-emerald-400 mt-2">
                <div
                  className="w-2 h-2 rounded-full bg-current animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-current animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-current animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-current animate-bounce"
                  style={{ animationDelay: "450ms" }}
                />
              </div>
              <div className="text-gray-300 mt-4">
                Formatting and finalizing your GitHub resume
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
  const { userId, markdown } = loaderData;
  const [isGenerating, setIsGenerating] = useState(true);

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

        {isGenerating ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            {/* Full-screen loading experience while generating */}
            <LoadingStates
              userId={userId}
              onComplete={() => setIsGenerating(false)}
            />
          </div>
        ) : (
          /* Resume Content (Markdown) - Only shown after generation complete */
          <div className="markdown-content bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800 animate-in fade-in duration-500">
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
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        )}

        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mt-10 rounded-full" />

        <footer className="text-center text-gray-400 text-xs mt-6">
          Built with GitHub data and AI generation
        </footer>
      </div>
    </main>
  );
}
