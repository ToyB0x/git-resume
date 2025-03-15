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
function LoadingStates({ userId }: { userId: string }) {
  const [currentState, setCurrentState] = useState<ResumeGenerationState>({
    type: ResumeEventType.GIT_SEARCH,
    foundCommits: 0,
    foundRepositories: 0,
  });
  const [isComplete, setIsComplete] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

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
                setCurrentState(parsedData as ResumeGenerationState);
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
            },
          },
        );
      } catch (err) {
        console.error("Error connecting to event source:", err);
        setIsConnected(false);
        setIsComplete(true);
      }
    };

    connectToEventSource();

    // Clean up on component unmount
    return () => {
      abortController.abort();
    };
  }, [userId]);

  // Render different UI based on state type
  const renderStateUI = () => {
    if (isComplete) {
      return (
        <div className="text-center text-green-400">
          <div className="mb-2">✓ Resume generation complete!</div>
          <div className="text-sm text-gray-400">
            Your personalized GitHub resume is ready
          </div>
        </div>
      );
    }

    // When not connected yet, show connecting message
    if (!isConnected) {
      return (
        <div className="text-center text-yellow-400">
          <div className="mb-2">Connecting to resume generator...</div>
          <div className="text-sm text-gray-400">
            Please wait while we establish connection
          </div>
        </div>
      );
    }

    switch (currentState.type) {
      case ResumeEventType.GIT_SEARCH:
        return (
          <div>
            <div className="mb-2 text-blue-400">
              Searching GitHub repositories...
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <div>Found {currentState.foundCommits || 0} commits</div>
              <div>
                Found {currentState.foundRepositories || 0} repositories
              </div>
            </div>
          </div>
        );
      case ResumeEventType.GIT_CLONE:
        return (
          <div>
            <div className="mb-2 text-indigo-400">Cloning repositories...</div>
            <div className="text-sm text-gray-400 space-y-1">
              <div>Repository: {currentState.repository}</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{
                      width: `${(currentState.current / currentState.total) * 100}%`,
                    }}
                  />
                </div>
                <span>
                  {currentState.current}/{currentState.total}
                </span>
              </div>
            </div>
          </div>
        );
      case ResumeEventType.ANALYZE:
        return (
          <div>
            <div className="mb-2 text-purple-400">
              Analyzing repository content...
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <div>Repository: {currentState.repository}</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${(currentState.current / currentState.total) * 100}%`,
                    }}
                  />
                </div>
                <span>
                  {currentState.current}/{currentState.total}
                </span>
              </div>
            </div>
          </div>
        );
      case ResumeEventType.CREATE_SUMMARY:
        return (
          <div>
            <div className="mb-2 text-cyan-400">Creating summaries...</div>
            <div className="text-sm text-gray-400 space-y-1">
              {currentState.repository && (
                <div>Repository: {currentState.repository}</div>
              )}
              <div className="flex items-center">
                <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{
                      width: `${(currentState.current / currentState.total) * 100}%`,
                    }}
                  />
                </div>
                <span>
                  {currentState.current}/{currentState.total}
                </span>
              </div>
            </div>
          </div>
        );
      case ResumeEventType.CREATING_RESUME:
        return (
          <div>
            <div className="mb-2 text-emerald-400">
              Generating final resume...
            </div>
            <div className="text-sm text-gray-400">
              Formatting and finalizing your GitHub resume
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <div className="relative mr-3">
          <div className="h-8 w-8 rounded-full border-2 border-b-transparent border-blue-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
            {isComplete ? "✓" : ""}
          </div>
        </div>
        <div className="flex-1">{renderStateUI()}</div>
      </div>
    </div>
  );
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { userId, markdown } = loaderData;
  const [showLoading, setShowLoading] = useState(true);

  // Hide the loading states after 60 seconds (1 minute)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

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

        {/* Real-time state update UI with SSE - shows for 1 minute */}
        {showLoading && <LoadingStates userId={userId} />}

        {/* Resume Content (Markdown) */}
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
              {markdown}
            </ReactMarkdown>
          </div>
        </div>

        {/* Frontmatter data is no longer displayed */}

        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mt-10 rounded-full" />

        <footer className="text-center text-gray-400 text-xs mt-6">
          Built with GitHub data and AI generation
        </footer>
      </div>
    </main>
  );
}
