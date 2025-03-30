import type { ResearchStep } from "../../data/mockData";
import type { ResearchStepStatus } from "../../data/mockData";

interface StepCardProps {
  step: ResearchStep | ResearchStepStatus;
  progress?: number; // undefinedの場合はPlan画面;
  isActive?: boolean; // undefinedの場合はPlan画面 / Progress画面において現在のステップかどうか
}

export function StepCard({ step, progress, isActive }: StepCardProps) {
  const mode = progress === undefined ? "plan" : "progress";
  const leftTextColor =
    mode === "plan" || isActive ? "text-white" : "text-gray-300";

  return (
    <div
      // className={`glass rounded-lg p-3 border ${statusClasses} ${className} backdrop-blur-sm transition-all duration-300`}
      className={"glass rounded-lg p-3"}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          {/* タイトル行 - アイコンとタイトルを横並びに */}
          <div className={`flex items-center ${leftTextColor}`}>
            <div className={"mr-2 flex-shrink-0"}>{stepIcons[step.id]}</div>
            <h4 className={"text-sm font-semibold"}>{step.name}</h4>
          </div>

          {/* ステータスまたは説明文 */}
          <p className="ml-6 text-xs text-gray-300 mt-1 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* 進捗状況の詳細表示（showProgressDetailsがtrueの場合のみ） */}
        {mode === "progress" && (
          <div className="text-right font-medium text-sm">
            <div
              className={
                isActive ? "text-blue-300 animate-pulse" : "text-gray-300"
              }
            >
              {progress}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ステップ名に基づいてアイコンを選択
const stepIcons: { [key: number]: React.ReactNode } = {
  1: (
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Search</title>
      <path
        fillRule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clipRule="evenodd"
      />
    </svg>
  ),
  2: (
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Clone</title>
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
  3: (
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Analysis</title>
      <path
        fillRule="evenodd"
        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  4: (
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Resume</title>
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

// // ステータスに基づいてスタイルとアイコンを決定
// const statusClasses =
//     progress === 100
//         ? "border-green-800 bg-opacity-20 bg-green-900"
//         : progress !== null
//             ? "border-blue-800 bg-opacity-20 bg-blue-900"
//             : "border-gray-700";
// let statusIcon = null;
//
// if (progress === 100) {
//   statusIcon = (
//       <svg
//           className="w-4 h-4 text-green-400 mr-2 flex-shrink-0"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//           xmlns="http://www.w3.org/2000/svg"
//       >
//         <title>Completed</title>
//         <path
//             fillRule="evenodd"
//             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//             clipRule="evenodd"
//         />
//       </svg>
//   );
// } else if (status !== null) {
//   statusIcon = (
//       <svg
//           className="w-4 h-4 text-blue-400 mr-2 animate-pulse flex-shrink-0"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//           xmlns="http://www.w3.org/2000/svg"
//       >
//         <title>In Progress</title>
//         <path
//             fillRule="evenodd"
//             d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
//             clipRule="evenodd"
//         />
//       </svg>
//   );
// } else {
//   statusIcon = (
//       <div className="mr-2 opacity-70 flex-shrink-0">{stepIcons[step.id]}</div>
//   );
// }
//
// // ステータスがない場合（plan画面）のデフォルトスタイル
// if (!status) {
//   // statusClasses =
//   //   "border-gray-800 transition-all duration-300 hover:-translate-y-1 hover:border-blue-700";
//   statusIcon = <div className="mr-2 flex-shrink-0">{stepIcons[step.id]}</div>;
// }
//
