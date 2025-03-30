import ReactMarkdown from "react-markdown";
import { useParams } from "react-router";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Layout } from "../components/layout/Layout";
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
  const completedDate = new Date(result.completedAt).toLocaleDateString();

  const handleExport = () => {
    alert("Export functionality would be implemented here");
  };

  const handleShare = () => {
    alert("Share functionality would be implemented here");
  };

  return (
    <Layout>
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Basic Information Section */}
          <UserInfoCard
            user={user}
            showLocation
            showProfileLink
            additionalInfo={`Analysis completed: ${completedDate}`}
          />

          {/* Resume Content */}
          <div className="glass rounded-xl border border-gray-800 shadow-xl p-6 mb-8">
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
                {result.markdown}
              </ReactMarkdown>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-8">
            <button
              type="button"
              onClick={handleExport}
              className="flex-1 btn-gradient text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Export</title>
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Share</title>
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}
