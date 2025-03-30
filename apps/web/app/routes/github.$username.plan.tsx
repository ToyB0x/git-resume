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

  return (
    // <main className="flex-grow container mx-auto px-4 py-10">
    <div className="container mx-auto max-w-3xl">
      {/* Basic Information Section */}
      <UserInfoCard user={user} />

      {/* Research Plan */}
      <Card marginBottom="mb-6">
        <SectionTitle className="w-fit">Research Plan</SectionTitle>

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
      <button
        type="button"
        onClick={handleExecute}
        className="w-full btn-gradient"
      >
        Execute Research
      </button>
    </div>
  );
}
