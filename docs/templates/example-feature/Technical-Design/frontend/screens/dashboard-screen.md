# ダッシュボード画面設計

**更新日**: 2025/03/01
**確認日**: 2025/03/01

## 概要

このドキュメントではユーザーダッシュボード画面の詳細な設計について説明します。この画面はgit-resumeアプリケーションの主要な部分となり、ユーザーのGitHub活動データをカスタマイズ可能なウィジェットを通じて視覚的に表示します。

## 画面レイアウト

ダッシュボード画面は以下の主要セクションで構成されます：

```
+-------------------------------------------------------+
| ヘッダー (アプリロゴ、ユーザー情報、通知、設定)        |
+-------------------------------------------------------+
| ダッシュボードコントロール                             |
| (時間範囲、更新ボタン、レイアウト切替、ウィジェット追加)|
+-------------------------------------------------------+
|                                                       |
|  +-------------+  +-------------+  +-------------+    |
|  |             |  |             |  |             |    |
|  | スキル      |  | 活動統計    |  | リポジトリ  |    |
|  | ウィジェット |  | ウィジェット |  | ウィジェット |    |
|  |             |  |             |  |             |    |
|  +-------------+  +-------------+  +-------------+    |
|                                                       |
|  +---------------------------+  +------------------+  |
|  |                           |  |                  |  |
|  | コントリビューショングラフ  |  | 言語分布        |  |
|  | ウィジェット               |  | ウィジェット     |  |
|  |                           |  |                  |  |
|  +---------------------------+  +------------------+  |
|                                                       |
|  +------------------------------------------+         |
|  |                                          |         |
|  | キャリアトレンド分析ウィジェット          |         |
|  |                                          |         |
|  +------------------------------------------+         |
|                                                       |
+-------------------------------------------------------+
| フッター (エクスポート、共有、設定)                    |
+-------------------------------------------------------+
```

## コンポーネント設計

### 1. ダッシュボードコンテナ

```typescript
// apps/web/app/routes/dashboard.tsx

import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useDashboardSocket } from '../hooks/useDashboardSocket';
import { useUserSettings } from '../hooks/useUserSettings';
import { DashboardHeader, DashboardControls, WidgetGrid, DashboardFooter } from '../components/dashboard';
import { dashboardApi } from '../api/dashboard';

export default function DashboardScreen() {
  const { layout, saveLayout } = useUserSettings();
  const { data, isLoading, error } = useQuery(
    'dashboardData', 
    dashboardApi.getDashboard,
    { staleTime: 300000 } // 5分キャッシュ
  );
  
  const { connected, lastUpdate } = useDashboardSocket();

  // レイアウト変更ハンドラ
  const handleLayoutChange = (newLayout) => {
    saveLayout(newLayout);
  };
  
  // リアルタイム更新
  useEffect(() => {
    if (lastUpdate) {
      // ダッシュボードデータの更新処理
    }
  }, [lastUpdate]);

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="dashboard-container">
      <DashboardHeader user={data.user} />
      
      <DashboardControls 
        timeRange={data.timeRange}
        isConnected={connected}
        onRefresh={() => queryClient.invalidateQueries('dashboardData')}
      />
      
      <WidgetGrid
        layout={layout}
        widgets={data.widgets}
        onLayoutChange={handleLayoutChange}
      />
      
      <DashboardFooter
        onExport={() => {/* エクスポート処理 */}}
        onSettings={() => {/* 設定画面表示 */}}
      />
    </div>
  );
}
```

### 2. ウィジェットグリッド

```typescript
// apps/web/app/components/dashboard/WidgetGrid.tsx

import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { WidgetRenderer } from './WidgetRenderer';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface WidgetGridProps {
  widgets: Array<{
    id: string;
    type: string;
    data: any;
    config: any;
  }>;
  layout: {
    lg: Array<{ i: string; x: number; y: number; w: number; h: number }>;
    md: Array<{ i: string; x: number; y: number; w: number; h: number }>;
    sm: Array<{ i: string; x: number; y: number; w: number; h: number }>;
  };
  onLayoutChange: (layout: any) => void;
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  layout,
  onLayoutChange,
}) => {
  const layouts = {
    lg: layout.lg || [],
    md: layout.md || [],
    sm: layout.sm || [],
  };

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 9, sm: 6, xs: 4, xxs: 2 };

  return (
    <div className="widget-grid">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={100}
        isDraggable
        isResizable
        onLayoutChange={(currentLayout, allLayouts) => {
          onLayoutChange(allLayouts);
        }}
      >
        {widgets.map((widget) => (
          <div key={widget.id} className="widget-container">
            <WidgetRenderer
              type={widget.type}
              data={widget.data}
              config={widget.config}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};
```

### 3. ウィジェットレンダラー

```typescript
// apps/web/app/components/dashboard/WidgetRenderer.tsx

import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { WidgetSkeleton, WidgetError } from './WidgetCommon';

// 動的インポートによるウィジェットの遅延ロード
const SkillsWidget = lazy(() => import('./widgets/SkillsWidget'));
const ActivityWidget = lazy(() => import('./widgets/ActivityWidget'));
const ReposWidget = lazy(() => import('./widgets/ReposWidget'));
const LanguagesWidget = lazy(() => import('./widgets/LanguagesWidget'));
const TrendsWidget = lazy(() => import('./widgets/TrendsWidget'));

// ウィジェットタイプとコンポーネントのマッピング
const WIDGET_COMPONENTS = {
  SKILLS: SkillsWidget,
  ACTIVITY: ActivityWidget,
  REPOS: ReposWidget,
  LANGUAGES: LanguagesWidget,
  TRENDS: TrendsWidget,
};

interface WidgetRendererProps {
  type: string;
  data: any;
  config: any;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  type,
  data,
  config,
}) => {
  // 未知のウィジェットタイプの処理
  if (!WIDGET_COMPONENTS[type]) {
    return <WidgetError message={`Unknown widget type: ${type}`} />;
  }

  const WidgetComponent = WIDGET_COMPONENTS[type];

  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <WidgetError message={error.message} />
      )}
    >
      <Suspense fallback={<WidgetSkeleton />}>
        <WidgetComponent data={data} config={config} />
      </Suspense>
    </ErrorBoundary>
  );
};
```

## 代表的なウィジェット実装例

### スキルウィジェット

```typescript
// apps/web/app/components/dashboard/widgets/SkillsWidget.tsx

import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { WidgetHeader, WidgetContent } from '../WidgetCommon';

interface SkillsWidgetProps {
  data: {
    skills: Array<{
      name: string;
      level: number;
      growth: number;
    }>;
  };
  config: {
    title: string;
    showAll: boolean;
    sortBy: 'level' | 'growth' | 'name';
  };
}

const SkillsWidget: React.FC<SkillsWidgetProps> = ({ data, config }) => {
  // データ処理ロジック
  const processedSkills = useMemo(() => {
    let skills = [...data.skills];
    
    // ソート処理
    if (config.sortBy === 'level') {
      skills.sort((a, b) => b.level - a.level);
    } else if (config.sortBy === 'growth') {
      skills.sort((a, b) => b.growth - a.growth);
    } else {
      skills.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // 表示件数制限
    if (!config.showAll) {
      skills = skills.slice(0, 10);
    }
    
    return skills;
  }, [data.skills, config.sortBy, config.showAll]);
  
  // チャートデータの準備
  const chartData = {
    labels: processedSkills.map(skill => skill.name),
    datasets: [
      {
        label: 'スキルレベル',
        data: processedSkills.map(skill => skill.level),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: '成長率',
        data: processedSkills.map(skill => skill.growth),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
  };
  
  return (
    <div className="skills-widget widget">
      <WidgetHeader 
        title={config.title || 'スキル分析'} 
        onRefresh={() => {/* リフレッシュロジック */}}
        onConfigure={() => {/* 設定ダイアログ表示 */}}
      />
      <WidgetContent>
        <div className="chart-container" style={{ height: '200px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="skills-list">
          {processedSkills.map(skill => (
            <div key={skill.name} className="skill-item">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-level">レベル: {skill.level}</span>
              <span className="skill-growth">成長率: {skill.growth > 0 ? `+${skill.growth}` : skill.growth}</span>
            </div>
          ))}
        </div>
      </WidgetContent>
    </div>
  );
};

export default SkillsWidget;
```

## WebSocket接続との連携

```typescript
// apps/web/app/hooks/useDashboardSocket.ts

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { EVENTS } from '../constants/socketEvents';

interface DashboardSocketHook {
  connected: boolean;
  lastUpdate: any | null;
  error: Error | null;
}

export const useDashboardSocket = (): DashboardSocketHook => {
  const { token } = useAuth();
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    // ソケット接続
    socketRef.current = io('/dashboard', {
      auth: { token },
      transports: ['websocket'],
    });

    // イベントリスナー設定
    socketRef.current.on('connect', () => {
      setConnected(true);
      socketRef.current?.emit(EVENTS.CONNECT);
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
    });

    socketRef.current.on(EVENTS.UPDATE, (data) => {
      setLastUpdate(data);
    });

    socketRef.current.on('error', (err) => {
      setError(new Error(err.message || 'Socket connection error'));
    });

    // クリーンアップ
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  return { connected, lastUpdate, error };
};
```

## レスポンシブデザインの実装

ダッシュボード画面はモバイルからデスクトップまで、以下のブレイクポイントに対応します：

### デスクトップレイアウト (> 1024px)
- 3列グリッド (12カラム)
- 全ウィジェットを標準サイズで表示
- 詳細情報を全て表示

### タブレットレイアウト (640px - 1024px)
- 2列グリッド (9カラム)
- 一部ウィジェットはリサイズして表示
- 重要情報を優先表示

### モバイルレイアウト (< 640px)
- 1列グリッド (6カラム)
- ウィジェットは縦に積み上げて表示
- 最も重要な情報のみを簡略化して表示

CSS実装は以下のようになります：

```scss
// ウィジェットのベーススタイル
.widget {
  background: var(--widget-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

// レスポンシブ対応
@media (max-width: 640px) {
  .widget-content {
    padding: 8px;
  }
  
  .chart-container {
    height: 150px !important;
  }
  
  .skills-list {
    max-height: 120px;
    overflow-y: auto;
  }
  
  .widget-header {
    flex-direction: column;
    
    .widget-actions {
      margin-top: 8px;
    }
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .chart-container {
    height: 180px !important;
  }
  
  .skills-list {
    max-height: 150px;
  }
}
```

## アクセシビリティ対応

ダッシュボード画面では以下のアクセシビリティ対応を実装します：

1. **キーボードナビゲーション**
   - Tab キーでウィジェット間を移動可能
   - ウィジェット内の操作要素も Tab で順番に移動
   - Esc キーでモーダルやポップオーバーを閉じる

2. **スクリーンリーダー対応**
   - 全てのグラフには aria-label と説明テキストを追加
   - SVG要素には適切な role と aria 属性を設定
   - 状態変化は aria-live 領域で通知

3. **フォーカス管理**
   - フォーカス状態の視覚的表示（アウトライン）
   - モーダル表示時のフォーカストラップ
   - キーボード操作のヘルプ情報

## パフォーマンス最適化

### コンポーネントの最適化

```typescript
// メモ化を使用したウィジェットコンポーネント
const MemoizedSkillsWidget = React.memo(SkillsWidget, (prevProps, nextProps) => {
  // deep comparison for data and config props
  return (
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
    JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config)
  );
});

// Intersection Observer による遅延レンダリング
const LazyWidget = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={ref}>
      {isVisible ? children : <WidgetSkeleton />}
    </div>
  );
};
```

## 今後の拡張性

ダッシュボード画面は以下の拡張に対応できるよう設計されています：

1. **カスタムウィジェット追加**
   - ウィジェットレジストリによるプラグイン式拡張
   - ユーザー定義ウィジェットのサポート

2. **データソース拡張**
   - GitLab、Bitbucketなどの追加ソース
   - Stack Overflowなどの技術コミュニティ活動

3. **テーマ対応**
   - ライト/ダークモード切り替え
   - カスタムカラーテーマ

4. **エクスポート機能**
   - PDF出力
   - 画像出力
   - データエクスポート（CSV、JSON）

## Changelog

- 2025/03/01: 初回作成
