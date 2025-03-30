import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
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

  const handleCancel = () => {
    navigate("/");
  };

  // モックデータの取得
  const user = getMockUser(username || "");

  return (
    <div className="container mx-auto max-w-3xl">
      {/* Basic Information Section */}
      <UserInfoCard user={user} />

      {/* Step List */}
      <Card marginBottom="mb-6">
        <SectionTitle className="w-fit">Research Steps</SectionTitle>

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
        <div className="flex items-center text-gray-400">
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Safe Exit</title>
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm">
            You can safely exit at any time. Research will continue in the
            background.
          </span>
        </div>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
        >
          Cancel Research
        </button>
      </div>
    </div>
  );
}
