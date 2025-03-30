import ReactMarkdown from "react-markdown";
import { useParams } from "react-router";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { ShareButton } from "~/components/ui/ShareButton";
import { Card } from "../components/ui/Card";
import { SectionTitle } from "../components/ui/SectionTitle";
import { UserInfoCard } from "../components/ui/UserInfoCard";
import { getMockResumeResult, getMockUser } from "../data/mockData";
import type { Route } from "./+types/github.$username.results";

// biome-ignore lint/correctness/noEmptyPattern: template default
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Results - Git Resume" },
    { name: "description", content: "Generated resume for GitHub user" },
  ];
}

export default function Page() {
  const { username } = useParams<{ username: string }>();

  // モックデータの取得
  const user = getMockUser(username || "");
  const result = getMockResumeResult(username || "");

  return (
    <div className="container mx-auto max-w-3xl pt-6">
      {/* Basic Information Section */}
      <UserInfoCard user={user} />

      {/* Resume Content */}
      <Card marginBottom="mb-8">
        <SectionTitle>Resume Content</SectionTitle>
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
                <ul className="text-gray-300 list-disc pl-5 my-3" {...props} />
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
            {result.markdown}
          </ReactMarkdown>
        </div>
      </Card>

      <ShareButton />
    </div>
  );
}
