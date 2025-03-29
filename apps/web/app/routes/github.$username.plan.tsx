import { useParams, useNavigate } from "react-router";
import { Layout } from "../components/layout/Layout";
import { getMockUser, getMockResearchPlan } from "../data/mockData";
import type { Route } from "./+types/github.$username.plan";

// biome-ignore lint/correctness/noEmptyPattern: template default
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Research Plan - Git Resume" },
    { name: "description", content: "Research plan for GitHub user" },
  ];
}

export default function Page() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  
  // モックデータの取得
  const user = getMockUser(username || "");
  const plan = getMockResearchPlan(username || "");

  const handleExecute = () => {
    navigate(`/github/${username}/progress`);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Layout>
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Basic Information Section */}
          <div className="glass rounded-xl border border-gray-800 shadow-xl p-6 mb-8">
            <div className="flex items-center">
              <img 
                src={user.avatarUrl} 
                alt={`${user.name}'s GitHub Avatar`}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className="text-gray-300">{user.bio}</p>
                <div className="flex items-center mt-1">
                  {user.location && (
                    <span className="text-sm text-gray-400 flex items-center mr-4">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <title>Location</title>
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {user.location}
                    </span>
                  )}
                  <span className="text-sm text-gray-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <title>GitHub Profile</title>
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <a 
                      href={user.profileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-colors"
                    >
                      {user.profileUrl}
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Research Plan Overview */}
          <div className="glass rounded-xl border border-gray-800 shadow-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Research Plan Overview</h3>

            <div className="space-y-4">
              {plan.steps.map((step) => (
                <div key={step.id} className="glass rounded-lg p-4 border border-gray-800 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                      {step.id}
                    </div>
                    <h4 className="font-medium">{step.name}</h4>
                  </div>
                  <p className="text-gray-300 mt-2 ml-11">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Time Display */}
          <div className="glass rounded-xl border border-gray-800 shadow-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Estimated Time</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-300">
                  Number of repositories: <span className="text-white font-medium">{plan.repositoryCount}</span>
                </p>
                <p className="text-gray-300 mt-1">
                  Estimated time: <span className="text-white font-medium">about {plan.estimatedTime} minutes</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Results will be stored for 30 days</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleExecute}
              className="flex-1 btn-gradient text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Execute Research
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}