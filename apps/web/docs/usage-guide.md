# @resume/web 使用ガイド

**更新日**: 2025/3/29
**確認日**: 2025/3/29
**自動生成**: このドキュメントはAIによって自動生成されています

## 基本的な使用方法

@resume/webパッケージは、git-resumeプロジェクトのWebフロントエンドアプリケーションです。以下に主要な使用方法を示します。

### 前提条件

Webアプリケーションを実行するには、以下の環境変数が必要です：

```bash
# 必須環境変数
VITE_API_URL=http://localhost:3000  # バックエンドAPIのURL
```

### ローカル開発環境での起動

```bash
# 依存パッケージのインストール
pnpm install

# 開発サーバーの起動
pnpm dev --filter=web

# ビルド
pnpm build --filter=web

# ビルド済みアプリのプレビュー
pnpm preview --filter=web
```

## 主要な機能と使用例

### 1. ウェルカム画面

アプリケーションのホーム画面です。GitHubユーザー名を入力してレジュメ生成プロセスを開始できます。

```tsx
// app/routes/home.tsx
import { Welcome } from "../welcome/welcome";

export default function Page() {
  return <Welcome />;
}
```

### 2. GitHubユーザー情報の表示とレジュメ生成

GitHubユーザーのレジュメを生成し、表示します。Server-Sent Events（SSE）を使用して、レジュメ生成プロセスの進捗状況をリアルタイムに表示します。

```tsx
// 基本的な使用例
import { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { EventType, ResumeEventType } from "@resume/models";

function ResumeGenerator({ userId }) {
  const [currentState, setCurrentState] = useState(null);
  const [resumeMarkdown, setResumeMarkdown] = useState("");
  
  useEffect(() => {
    const abortController = new AbortController();
    
    const connectToEventSource = async () => {
      await fetchEventSource(`${import.meta.env.VITE_API_URL}/api/github/${userId}/progress`, {
        signal: abortController.signal,
        onmessage: (event) => {
          const { event: eventTypeStr, data } = event;
          const parsedData = JSON.parse(data);
          
          if (eventTypeStr === EventType.RESUME_PROGRESS) {
            setCurrentState(parsedData);
            
            if (parsedData.type === ResumeEventType.COMPLETE) {
              setResumeMarkdown(parsedData.markdown);
            }
          }
        },
        // エラーハンドリングなど
      });
    };
    
    connectToEventSource();
    
    return () => {
      abortController.abort();
    };
  }, [userId]);
  
  // レンダリングロジック
}
```

## カスタマイズ例

### 1. カスタムテーマの適用

アプリケーションのテーマをカスタマイズする例：

```tsx
// app/theme.ts
export const theme = {
  colors: {
    primary: {
      light: "#7dd3fc",
      main: "#0ea5e9",
      dark: "#0369a1",
    },
    secondary: {
      light: "#c4b5fd",
      main: "#8b5cf6",
      dark: "#6d28d9",
    },
    // その他のカラー
  },
  // フォントなどの設定
};

// app/root.tsx
import { theme } from "./theme";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ... */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-primary: ${theme.colors.primary.main};
            --color-primary-light: ${theme.colors.primary.light};
            --color-primary-dark: ${theme.colors.primary.dark};
            --color-secondary: ${theme.colors.secondary.main};
            --color-secondary-light: ${theme.colors.secondary.light};
            --color-secondary-dark: ${theme.colors.secondary.dark};
          }
        `}} />
      </head>
      <body>
        {children}
        {/* ... */}
      </body>
    </html>
  );
}
```

### 2. カスタムAPIクライアントの実装

バックエンドAPIとの通信をカスタマイズする例：

```tsx
// app/clients/api.ts
import { Hono } from "hono";
import type { ResumeGenerationState } from "@resume/models";

type Variables = {
  userName: string;
};

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const hClient = new Hono<{
  Variables: Variables;
}>()
  .basePath(apiUrl);

export const api = {
  getUser: async (userName: string) => {
    const response = await fetch(`${apiUrl}/api/github/${userName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  },
  
  connectToSSE: (
    userName: string,
    onMessage: (state: ResumeGenerationState) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ) => {
    const eventSource = new EventSource(`${apiUrl}/api/github/${userName}/progress`);
    
    eventSource.addEventListener("resume_progress", (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
      
      if (data.type === "Complete") {
        onComplete();
        eventSource.close();
      }
    });
    
    eventSource.addEventListener("error", (event) => {
      onError(new Error("SSE connection error"));
      eventSource.close();
    });
    
    return () => {
      eventSource.close();
    };
  }
};
```

## デプロイメント例

### Cloudflare Pagesへのデプロイ

```bash
# ビルド
pnpm build --filter=web

# Cloudflare Pagesへのデプロイ
pnpm deploy --filter=web
```

または、wranglerを直接使用：

```bash
# ビルド
pnpm build --filter=web

# Cloudflare Pagesへのデプロイ
wrangler pages deploy build --project-name git-resume
```

### GitHub Actionsを使用した自動デプロイ

```yaml
# .github/workflows/deploy-web.yml
name: Deploy Web App

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'
      - 'packages/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
          
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.4.1
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Build
        run: pnpm build --filter=web
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
          
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          command: pages deploy build --project-name git-resume
```

## 注意事項

- バックエンドAPIが実行されていることを確認してください。デフォルトでは`http://localhost:3000`に接続を試みます。
- レジュメ生成プロセスは、リポジトリの数や規模によっては時間がかかる場合があります。
- Cloudflare Workersにデプロイする場合、環境変数の設定を忘れないようにしてください。
- 開発中は、React Router DevToolsを使用してルーティングのデバッグを行うことができます。