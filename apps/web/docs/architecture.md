# @resume/web アーキテクチャ

**更新日**: 2025/3/29
**確認日**: 2025/3/29
**自動生成**: このドキュメントはAIによって自動生成されています

## 主要な設計思想

@resume/webパッケージは、以下の設計思想に基づいて構築されています：

1. **モダンなReactアーキテクチャ** - React Router v7を採用し、最新のReactパターンを活用
2. **リアルタイム通信** - Server-Sent Events（SSE）を使用したリアルタイムな進捗状況の通知
3. **レスポンシブデザイン** - モバイルからデスクトップまで対応する適応型レイアウト
4. **アクセシビリティ** - WAI-ARIAに準拠したアクセシブルなUI
5. **パフォーマンス最適化** - 効率的なレンダリングとリソース管理

## 主要なモジュール構成

パッケージは以下の主要なモジュールで構成されています：

1. **ルートコンポーネント** (`app/root.tsx`) - アプリケーションのルートレイアウトとエラーハンドリング
2. **ルート定義** (`app/routes.ts`) - アプリケーションのルーティング設定
3. **ページコンポーネント** (`app/routes/`) - 各ページのコンポーネント
   - `home.tsx` - ホームページ（ウェルカム画面）
   - `github.$userId.tsx` - GitHubユーザーページ（レジュメ生成・表示）
4. **ウェルカムコンポーネント** (`app/welcome/welcome.tsx`) - ウェルカム画面のコンポーネント
5. **APIクライアント** (`app/clients/`) - バックエンドAPIとの通信

## 主要な処理フロー

### ユーザー検索フロー

1. **ウェルカム画面表示** - ユーザーがアプリケーションにアクセス
2. **ユーザー名入力** - ユーザーがGitHubユーザー名を入力
3. **検索実行** - ユーザーが検索ボタンをクリック
4. **ユーザーページへのリダイレクト** - GitHubユーザーページへ遷移

### レジュメ生成フロー

1. **ユーザーページ表示** - GitHubユーザーページの表示
2. **SSE接続確立** - バックエンドAPIとのSSE接続を確立
3. **進捗状況の表示** - レジュメ生成プロセスの進捗状況をリアルタイムに表示
   - GitHubリポジトリの検索
   - リポジトリのクローン
   - リポジトリの解析
   - サマリーの生成
   - レジュメの作成
4. **レジュメ表示** - 生成されたレジュメをマークダウン形式で表示

## コンポーネント構造

### ルートコンポーネント

ルートコンポーネント（`app/root.tsx`）は、アプリケーション全体のレイアウトとエラーハンドリングを担当します：

```tsx
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // エラーハンドリングロジック
}
```

### GitHubユーザーページ

GitHubユーザーページ（`app/routes/github.$userId.tsx`）は、レジュメ生成プロセスの進捗状況とレジュメの表示を担当します：

```tsx
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const userId = params.userId;
  return { userId };
}

function LoadingStates({ userId }: { userId: string }) {
  // SSE接続とステート管理
  // 進捗状況の表示
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { userId } = loaderData;
  return (
    <main>
      <LoadingStates userId={userId} />
    </main>
  );
}
```

## 外部依存関係

パッケージは以下の主要な外部依存関係を持ちます：

1. **React** - UIライブラリ
2. **React Router** - ルーティングライブラリ
3. **React Markdown** - マークダウンレンダリング
4. **@microsoft/fetch-event-source** - SSEクライアント
5. **Hono** - APIクライアント
6. **Tailwind CSS** - スタイリング
7. **Cloudflare Workers** - デプロイメントプラットフォーム

## レスポンシブデザイン戦略

アプリケーションは以下のレスポンシブデザイン戦略を採用しています：

1. **フレキシブルレイアウト** - コンテナの最大幅を制限し、小さな画面でも適切に表示
2. **モバイルファースト** - モバイル向けのデザインを基本とし、大きな画面向けに拡張
3. **グリッドシステム** - Tailwind CSSのグリッドシステムを使用した柔軟なレイアウト
4. **メディアクエリ** - 画面サイズに応じたスタイルの調整

## パフォーマンス最適化

アプリケーションは以下のパフォーマンス最適化を実施しています：

1. **コード分割** - React Routerによるルートベースのコード分割
2. **遅延読み込み** - 必要なコンポーネントの遅延読み込み
3. **キャッシュ戦略** - Cloudflare Workersのキャッシュ機能の活用
4. **最適化されたビルド** - Viteによる最適化されたビルドプロセス

## デプロイメント戦略

アプリケーションは以下のデプロイメント戦略を採用しています：

1. **Cloudflare Pages/Workers** - 高速なグローバルCDNとエッジコンピューティング
2. **CI/CD** - 継続的インテグレーション/デプロイメントパイプライン
3. **環境分離** - 開発、ステージング、本番環境の分離
4. **ゼロダウンタイムデプロイ** - ダウンタイムのないデプロイプロセス