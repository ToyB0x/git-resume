import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Layout } from "../components/layout/Layout";
import { UserInfoCard } from "../components/ui/UserInfoCard";
import { StepCard } from "../components/ui/StepCard";
import { getMockUser, getMockResearchProgress } from "../data/mockData";
import { ProgressBar } from "../components/ui/LoadingIndicators";
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
  const [progress, setProgress] = useState(getMockResearchProgress(username || "", stage));

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
      setProgress(getMockResearchProgress(username || "", stage + 1));
    }, 10000);

    return () => clearTimeout(timer);
  }, [stage, username, navigate]);

  const handleCancel = () => {
    navigate("/");
  };

  // モックデータの取得
  const user = getMockUser(username || "");

  return (
    <Layout>
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Basic Information Section */}
          <UserInfoCard user={user} />

          {/* Progress Bar */}
          <div className="glass rounded-xl border border-gray-800 shadow-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">Research Progress</h3>
              <span className="text-gray-300">{progress.overallProgress}%</span>
            </div>
            <ProgressBar progress={progress.overallProgress} className="mb-4" />

            {/* Safe Exit Indicator */}
            <div className="flex items-center text-green-400">
              <svg className="w-5 h-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Safe Exit</title>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">You can safely exit at any time. Research will continue in the background.</span>
            </div>
          </div>

          {/* Step List */}
          <div className="glass rounded-xl border border-gray-800 shadow-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Research Steps</h3>

            <div className="space-y-4">
              {progress.steps.map((step) => (
                <StepCard 
                  key={step.id} 
                  step={step} 
                  status={step.status} 
                  progress={step.progress} 
                />
              ))}
            </div>
          </div>

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
      </main>
    </Layout>
  );
}