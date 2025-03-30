import type { ResearchStep } from "../../data/mockData";
import type { ResearchStepStatus } from "../../data/mockData";

interface StepCardProps {
  step: ResearchStep | ResearchStepStatus;
  status?: 'completed' | 'in-progress' | 'waiting';
  progress?: number | undefined;
  className?: string;
  showProgressDetails?: boolean;
}

export function StepCard({ 
  step, 
  status, 
  progress, 
  className = "",
  showProgressDetails = false
}: StepCardProps) {
  // ステータスに基づいてスタイルとアイコンを決定
  let statusClasses = "";
  let statusIcon = null;

  if (status === "completed") {
    statusClasses = "border-green-800 bg-opacity-20 bg-green-900";
    statusIcon = (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Completed</title>
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    );
  } else if (status === "in-progress") {
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
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
        <span>{step.id}</span>
      </div>
    );
  }

  // ステータスがない場合（plan画面）のデフォルトスタイル
  if (!status) {
    statusClasses = "border-gray-800 transition-all duration-300 hover:-translate-y-1";
    statusIcon = (
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
        {step.id}
      </div>
    );
  }

  // 進行中のステップの場合、残り時間を計算（モック）
  const remainingTime = status === "in-progress" && progress !== undefined 
    ? Math.ceil((100 - progress) / 10) // 10%ごとに1分と仮定
    : null;

  return (
    <div className={`glass rounded-lg p-4 border ${statusClasses} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {statusIcon}
          <div>
            <h4 className={`font-medium ${
              status === "completed" ? "text-green-300" : 
              (status === "in-progress" ? "text-blue-300" : "text-white")
            }`}>
              {step.name}
            </h4>
            {status ? (
              <p className={`text-sm mt-1 ${status === "waiting" ? "text-gray-500" : "text-gray-300"}`}>
                {status === "completed" ? "Completed" : (status === "in-progress" ? "In progress" : "Waiting")}
              </p>
            ) : (
              'description' in step && (
                <p className="text-gray-300 mt-2">{step.description}</p>
              )
            )}
          </div>
        </div>

        {/* 進捗状況の詳細表示（showProgressDetailsがtrueの場合のみ） */}
        {showProgressDetails && status === "in-progress" && progress !== undefined && (
          <div className="text-right">
            <div className="text-blue-300 font-medium animate-pulse">
              {progress}%
            </div>
            {remainingTime !== null && (
              <div className="text-sm text-gray-400">
                ~{remainingTime} min left
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}