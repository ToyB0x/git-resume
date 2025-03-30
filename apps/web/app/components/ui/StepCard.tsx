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
  
  // ステップ名に基づいてアイコンを選択
  const getStepIcon = (stepId: number, stepName: string) => {
    // ステップ名に基づいて適切なアイコンを返す
    if (stepName.includes("Search")) {
      return (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Search</title>
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (stepName.includes("Clone")) {
      return (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Clone</title>
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (stepName.includes("Analysis")) {
      return (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Analysis</title>
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (stepName.includes("Resume") || stepName.includes("Creation")) {
      return (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Resume</title>
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    }
    
    // デフォルトは数字を表示
    return <span className="text-xs font-medium">{stepId}</span>;
  };

  // 共通のアイコン背景スタイル - サイトのアクセントカラーに合わせたグラデーション
  const iconBgClass = "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600";
  
  if (status === "completed") {
    statusClasses = "border-green-800 bg-opacity-20 bg-green-900";
    statusIcon = (
      <div className={`w-7 h-7 rounded-full ${iconBgClass} flex items-center justify-center mr-3 shadow-sm`}>
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Completed</title>
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    );
  } else if (status === "in-progress") {
    statusClasses = "border-blue-800 bg-opacity-20 bg-blue-900";
    statusIcon = (
      <div className={`w-7 h-7 rounded-full ${iconBgClass} flex items-center justify-center mr-3 animate-pulse shadow-sm`}>
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>In Progress</title>
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      </div>
    );
  } else {
    statusClasses = "border-gray-700";
    statusIcon = (
      <div className={`w-7 h-7 rounded-full ${iconBgClass} opacity-70 flex items-center justify-center mr-3 shadow-sm`}>
        {getStepIcon(step.id, step.name)}
      </div>
    );
  }

  // ステータスがない場合（plan画面）のデフォルトスタイル
  if (!status) {
    statusClasses = "border-gray-800 transition-all duration-300 hover:-translate-y-1 hover:border-blue-700";
    statusIcon = (
      <div className={`w-7 h-7 rounded-full ${iconBgClass} flex items-center justify-center mr-3 shadow-sm`}>
        {getStepIcon(step.id, step.name)}
      </div>
    );
  }

  // 進行中のステップの場合、残り時間を計算（モック）
  const remainingTime = status === "in-progress" && progress !== undefined 
    ? Math.ceil((100 - progress) / 10) // 10%ごとに1分と仮定
    : null;

  return (
    <div className={`glass rounded-lg p-3 border ${statusClasses} ${className} backdrop-blur-sm transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {statusIcon}
          <div>
            <h4 className={`text-sm font-semibold tracking-tight ${
              status === "completed" ? "text-green-300" : 
              (status === "in-progress" ? "text-blue-300" : "text-white")
            }`}>
              {step.name}
            </h4>
            {status ? (
              <p className={`text-xs mt-0.5 ${status === "waiting" ? "text-gray-500" : "text-gray-300"}`}>
                {status === "completed" ? "Completed" : (status === "in-progress" ? "In progress" : "Waiting")}
              </p>
            ) : (
              'description' in step && (
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">{step.description}</p>
              )
            )}
          </div>
        </div>

        {/* 進捗状況の詳細表示（showProgressDetailsがtrueの場合のみ） */}
        {showProgressDetails && status === "in-progress" && progress !== undefined && (
          <div className="text-right">
            <div className="text-blue-300 font-medium text-sm animate-pulse">
              {progress}%
            </div>
            {remainingTime !== null && (
              <div className="text-xs text-gray-400">
                ~{remainingTime} min left
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}