import { Link, useNavigate } from "react-router";
import { Layout } from "../components/layout/Layout";
import type { Route } from "./+types/error";

// biome-ignore lint/correctness/noEmptyPattern: template default
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Error - Git Resume" },
    { name: "description", content: "An error occurred" },
  ];
}

export default function Page() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/");
  };

  return (
    <Layout>
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="glass rounded-xl border border-gray-800 shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Error</title>
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-4">An Error Occurred</h2>

          <div className="glass rounded-lg p-4 border border-red-800 bg-opacity-20 bg-red-900 mb-6 text-left">
            <p className="text-red-300 font-medium">Error Code: 500</p>
            <p className="text-gray-300 mt-2">An unexpected error occurred during the research process. Please try again later.</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Troubleshooting</h3>
            <ul className="text-left text-gray-300 space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <title>Tip</title>
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Check the spelling of your GitHub username
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <title>Tip</title>
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Try clearing your browser cache
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <title>Tip</title>
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Check GitHub service status
              </li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/"
              className="flex-1 btn-gradient text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Return Home</title>
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Return to Home
            </Link>
            <button
              type="button"
              onClick={handleRetry}
              className="flex-1 glass text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Retry</title>
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}