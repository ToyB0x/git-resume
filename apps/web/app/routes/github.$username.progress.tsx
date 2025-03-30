import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
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
  const navigate = useNavigate();
  const [stage, setStage] = useState(1);
  const [progress, setProgress] = useState(getMockResearchProgress(stage));

  // 進捗状況を定期的に更新するシミュレーション
  useEffect(() => {
    // 最終ステージに達したら結果画面に遷移
    if (stage >= 5) {
      navigate(`/github/${username}/results`);
      return;
    }

    // 各ステージは10秒間隔で進行
    const timer = setTimeout(() => {
      setStage((prevStage) => prevStage + 1);
      setProgress(getMockResearchProgress(stage + 1));
    }, 31 * 1000);

    return () => clearTimeout(timer);
  }, [stage, username, navigate]);

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
          {progress.steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              status={step.status}
              progress={step.progress}
              showProgressDetails={step.status === "in-progress"}
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
