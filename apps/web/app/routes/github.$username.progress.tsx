import { useParams } from "react-router";
import { ShareButton } from "~/components/ui/ShareButton";
import { Card } from "../components/ui/Card";
import { SectionTitle } from "../components/ui/SectionTitle";
import { StepCard } from "../components/ui/StepCard";
import { UserInfoCard } from "../components/ui/UserInfoCard";
import { getMockResearchProgress, getMockUser } from "../data/mockData";
import type { Route } from "./+types/github.$username.progress";

// biome-ignore lint/correctness/noEmptyPattern: template default
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Research Progress - Git Resume" },
    { name: "description", content: "Research progress for GitHub user" },
  ];
}

export default function Page() {
  const { username } = useParams<{ username: string }>();
  const steps = getMockResearchProgress();

  // モックデータの取得
  const user = getMockUser(username || "");

  return (
    <div className="container mx-auto max-w-3xl">
      {/* Basic Information Section */}
      <UserInfoCard user={user} />

      {/* Step List */}
      <Card marginBottom="mb-6">
        <SectionTitle className="w-fit">Research Progress</SectionTitle>

        <div className="space-y-4 mb-6">
          {steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              progress={step.progress}
              isActive={step.isActive}
            />
          ))}
        </div>

        {/* Safe Exit Indicator - 移動済み */}
        <p className="text-sm text-gray-400 pl-1">
          You can safely exit at any time. Research will continue in the
          background.
        </p>
      </Card>

      <ShareButton />
    </div>
  );
}
