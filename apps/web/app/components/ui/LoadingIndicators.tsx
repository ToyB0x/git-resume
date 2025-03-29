export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-blue-500 motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
      aria-label="Loading"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}

export function ProgressBar({
  progress,
  className = "",
}: {
  progress: number;
  className?: string;
}) {
  return (
    <div className={`w-full bg-gray-800 rounded-full h-2.5 ${className}`}>
      <div
        className="progress-gradient h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function SkeletonLoader({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-800 rounded-md ${className}`}
      aria-label="Loading"
    />
  );
}

export function TextSkeletonLoader({
  lines = 1,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  // 配列のインデックスをキーとして使用する警告を回避するために、
  // 条件分岐で行数に応じて要素を直接レンダリングする方法に変更
  return (
    <div className={`space-y-2 ${className}`} aria-label="Loading">
      <div className="h-2.5 bg-gray-800 rounded-full animate-pulse" />
      {lines >= 2 && <div className="h-2.5 bg-gray-800 rounded-full animate-pulse" />}
      {lines >= 3 && <div className="h-2.5 bg-gray-800 rounded-full animate-pulse" />}
      {lines >= 4 && <div className="h-2.5 bg-gray-800 rounded-full animate-pulse" />}
      {lines >= 5 && <div className="h-2.5 bg-gray-800 rounded-full animate-pulse" />}
      {/* 5行以上は必要に応じて追加 */}
    </div>
  );
}

export function CardSkeletonLoader({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse glass border border-gray-800 rounded-lg p-6 ${className}`}
      aria-label="Loading"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-12 w-12 bg-gray-800 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-800 rounded-full" />
          <div className="h-2 bg-gray-800 rounded-full w-3/4" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-2 bg-gray-800 rounded-full" />
        <div className="h-2 bg-gray-800 rounded-full" />
        <div className="h-2 bg-gray-800 rounded-full w-3/4" />
      </div>
    </div>
  );
}