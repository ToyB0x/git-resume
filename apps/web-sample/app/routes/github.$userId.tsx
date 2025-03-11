import { hClient } from "~/clients";
import type { Route } from "./+types/github.$userId";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

// biome-ignore lint/correctness/noEmptyPattern: template default
export function meta({}: Route.MetaArgs) {
  return [
    { title: "GitHub Resume" },
    { name: "description", content: "View GitHub user resume" },
  ];
}

// Simple frontmatter parser that works in browser environment
function parseFrontmatter(text: string) {
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
  const match = text.match(frontmatterRegex);
  
  if (!match) {
    return { content: text, data: {} };
  }

  const frontmatterBlock = match[1];
  const content = text.replace(match[0], '').trim();
  const data: Record<string, any> = {};

  // Parse the frontmatter block
  frontmatterBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Handle quoted strings
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // Convert "true" and "false" strings to booleans
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      
      // Try to convert to number if applicable
      const num = Number(value);
      if (!isNaN(num) && value !== '') {
        value = num;
      }
      
      data[key] = value;
    }
  });

  return { content, data };
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

  // Parse frontmatter if present using browser-compatible function
  const { data: frontmatter, content } = parseFrontmatter(markdown);

  return {
    userId,
    markdown: content,
    frontmatter,
  };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { markdown, frontmatter } = loaderData;
  
  // Get title from frontmatter if available, or use default
  const title = frontmatter?.title ? frontmatter.title : "GitHub Resume";
  const description = frontmatter?.description ? frontmatter.description : "Profile generated from GitHub activity";

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 relative overflow-hidden p-4">
      <div className="relative bg-black/60 backdrop-blur-sm border border-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-8 z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-gray-300 mt-3">
            {description}
          </p>
        </header>

        {/* Resume Content (Markdown) */}
        <div className="markdown-content bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
          <div className="prose prose-invert max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>

        {/* Display additional frontmatter data if available */}
        {frontmatter && Object.keys(frontmatter).length > 0 && 
          frontmatter.showMetadata !== false && (
          <div className="mt-8 bg-black/30 p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-300 text-sm font-semibold mb-2">Profile Metadata</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(frontmatter)
                .filter(([key]) => !['title', 'description', 'showMetadata'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="text-gray-400 mr-2">{key}:</span>
                    <span className="text-gray-200">{String(value)}</span>
                  </div>
                ))}
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
