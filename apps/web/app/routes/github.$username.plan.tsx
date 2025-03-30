import { useNavigate, useParams } from "react-router";
import { Card } from "../components/ui/Card";
import { SectionTitle } from "../components/ui/SectionTitle";
import { StepCard } from "../components/ui/StepCard";
import { UserInfoCard } from "../components/ui/UserInfoCard";
import { getMockResearchPlan, getMockUser } from "../data/mockData";
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
  const plan = getMockResearchPlan();

  const handleExecute = () => {
    navigate(`/github/${username}/progress`);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    // <main className="flex-grow container mx-auto px-4 py-10">
    <div className="container mx-auto max-w-3xl">
      {/* Basic Information Section */}
      <UserInfoCard user={user} showLocation showProfileLink />

      {/* Research Plan Overview */}
      <Card marginBottom="mb-6">
        <SectionTitle className="w-fit">Research Plan Overview</SectionTitle>

        <div className="space-y-4">
          {plan.steps.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>

        <div className="text-sm text-gray-300 text-right mt-6">
          Estimated time: {plan.estimatedTime} minutes
        </div>
      </Card>

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
  );
}
