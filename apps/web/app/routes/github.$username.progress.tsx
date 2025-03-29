import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Layout } from "../components/layout/Layout";
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
              </div>
            </div>
          </div>

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
              {progress.steps.map((step) => {
                let statusClasses = "";
                let statusIcon = null;

                if (step.status === "completed") {
                  statusClasses = "border-green-800 bg-opacity-20 bg-green-900";
                  statusIcon = (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <title>Completed</title>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  );
                } else if (step.status === "in-progress") {
                  statusClasses = "border-blue-800 bg-opacity-20 bg-blue-900";
                  statusIcon = (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 animate-pulse">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <title>In Progress</title>
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </div>
                  );
                } else {
                  statusClasses = "border-gray-700";
                  statusIcon = (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      <span className="text-gray-300">{step.id}</span>
                    </div>
                  );
                }

                return (
                  <div key={step.id} className={`glass rounded-lg p-4 border ${statusClasses}`}>
                    <div className="flex items-center">
                      {statusIcon}
                      <div>
                        <h4 className={`font-medium ${step.status === "completed" ? "text-green-300" : (step.status === "in-progress" ? "text-blue-300" : "text-gray-400")}`}>
                          {step.name}
                        </h4>
                        <p className={`text-sm mt-1 ${step.status === "waiting" ? "text-gray-500" : "text-gray-300"}`}>
                          {step.status === "completed" ? "Completed" : (step.status === "in-progress" ? "In progress" : "Waiting")}
                          {step.progress !== undefined && step.status === "in-progress" && ` (${step.progress}% completed)`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
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