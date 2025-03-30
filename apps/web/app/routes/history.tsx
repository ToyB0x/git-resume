import { Link } from "react-router";
import { SectionTitle } from "~/components/ui/SectionTitle";
import { Card } from "../components/ui/Card";
import type { Route } from "./+types/history";

// biome-ignore lint/correctness/noEmptyPattern: template default
export function meta({}: Route.MetaArgs) {
  return [
    { title: "History - Git Resume" },
    { name: "description", content: "View your Git Resume history" },
  ];
}

// モックの履歴データ
const mockHistoryData = [
  {
    id: 1,
    username: "octocat",
    name: "The Octocat",
    avatarUrl: "https://avatars.githubusercontent.com/u/583231",
    analyzedAt: "2025-03-28T15:30:00Z",
  },
  {
    id: 2,
    username: "torvalds",
    name: "Linus Torvalds",
    avatarUrl: "https://avatars.githubusercontent.com/u/1024025",
    analyzedAt: "2025-03-27T10:15:00Z",
  },
  {
    id: 3,
    username: "gaearon",
    name: "Dan Abramov",
    avatarUrl: "https://avatars.githubusercontent.com/u/810438",
    analyzedAt: "2025-03-26T08:45:00Z",
  },
  {
    id: 4,
    username: "yyx990803",
    name: "Evan You",
    avatarUrl: "https://avatars.githubusercontent.com/u/499550",
    analyzedAt: "2025-03-25T14:20:00Z",
  },
  {
    id: 5,
    username: "sindresorhus",
    name: "Sindre Sorhus",
    avatarUrl: "https://avatars.githubusercontent.com/u/170270",
    analyzedAt: "2025-03-24T11:10:00Z",
  },
];

export default function Page() {
  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="container mx-auto max-w-3xl">
      {/* Information Box */}
      <Card className="flex items-start">
        <svg
          className="w-6 h-6 text-blue-400 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Information</title>
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-gray-300">
          You can access your results on this page for 30 days.
        </p>
      </Card>

      {/* History List */}
      <Card marginBottom="mt-6">
        <SectionTitle className="w-fit">Recently analyzed</SectionTitle>
        <div className="space-y-4">
          {mockHistoryData.map((item) => (
            <Link
              key={item.id}
              to={`/github/${item.username}/results`}
              className="glass rounded-lg p-4 border border-gray-800 flex items-center hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 block"
            >
              <img
                src={item.avatarUrl}
                alt={`${item.name}'s avatar`}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg text-white">
                    {item.username}
                  </h3>
                  <span className="text-sm text-gray-400">
                    {formatDate(item.analyzedAt)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{item.name}</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>View</title>
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          ))}
        </div>
      </Card>

      {/* Empty State (表示条件付き) */}
      {mockHistoryData.length === 0 && (
        <Card padding="p-8" textAlign="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-600 mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Empty History</title>
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No History Yet</h3>
          <p className="text-gray-400 mb-6">
            You haven't analyzed any GitHub profiles yet. Start by entering a
            GitHub username on the home page.
          </p>
          <Link
            to="/"
            className="btn-gradient text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
          >
            Go to Home
          </Link>
        </Card>
      )}
    </div>
  );
}
