import { useParams, useNavigate } from "react-router";
import { Layout } from "../components/layout/Layout";
import { UserInfoCard } from "../components/ui/UserInfoCard";
import { StepCard } from "../components/ui/StepCard";
import { SectionTitle } from "../components/ui/SectionTitle";
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
          <UserInfoCard user={user} showLocation showProfileLink />

          {/* Research Plan Overview */}
          <div className="glass rounded-xl border border-gray-800 shadow-xl p-6 mb-8">
            <SectionTitle>Research Plan Overview</SectionTitle>

            <div className="space-y-4">
              {plan.steps.map((step) => (
                <StepCard key={step.id} step={step} />
              ))}
            </div>
          </div>

          {/* Estimated Time Display */}
          <div className="glass rounded-xl border border-gray-800 shadow-xl p-6 mb-8">
            <SectionTitle>Estimated Time</SectionTitle>
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