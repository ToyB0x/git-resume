# APIサーバー実装ガイド

このドキュメントでは、APIサーバーの実装に必要なファイルとその内容を整理しています。既存の`apps/api`の構造を活用しつつ、新たに必要なファイルを追加します。

## ファイル構成

```
apps/api/
├── src/
│   ├── index.ts                  # エントリーポイント（修正）
│   ├── routes/
│   │   ├── api/
│   │   │   ├── index.ts          # ルート定義のエクスポート（修正）
│   │   │   ├── git-analysis/     # 新規追加
│   │   │   │   ├── index.ts      # Git分析関連ルートの定義
│   │   │   │   ├── getStatus.ts  # Git分析状態API
│   │   │   │   ├── getProfile.ts # 1次分析API
│   │   │   │   └── startJob.ts   # 2次分析起動API
│   │   │   └── github/           # 既存（必要に応じて修正）
│   ├── utils/
│   │   ├── index.ts              # ユーティリティのエクスポート
│   │   ├── env.ts                # 環境変数
│   │   ├── sseHelper.ts          # SSEヘルパー
│   │   └── db.ts                 # データベース接続（新規追加）
│   └── clients/                  # 新規追加
│       ├── index.ts              # クライアントのエクスポート
│       ├── github.ts             # GitHub APIクライアント
│       └── cloudRun.ts           # Cloud Run Jobsクライアント
```

## 実装内容

以下に各ファイルの実装内容を示します。

### 1. エントリーポイント（修正）

**`src/index.ts`**

```typescript
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { githubRoute } from "./routes/api/github";
import { gitAnalysisRoute } from "./routes/api/git-analysis"; // 追加
import { env } from "./utils";

const app = new Hono()
  .use(
    cors({
      origin: (origin) => {
        return origin.endsWith(env.RESUME_ALLOWED_ORIGIN)
          ? origin
          : "http://localhost:5173";
      },
    }),
  )
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .get("/health", (c) => {
    return c.json({ status: "ok" });
  })
  .route("/api/github", githubRoute)
  .route("/api/git-analysis", gitAnalysisRoute); // 追加

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(`Environment: ${env.RESUME_ENV}`);
  },
);

export type AppType = typeof app;
```

### 2. ルート定義のエクスポート（修正）

**`src/routes/api/index.ts`**

```typescript
export * from "./github";
export * from "./git-analysis"; // 追加
```

### 3. Git分析関連ルートの定義（新規）

**`src/routes/api/git-analysis/index.ts`**

```typescript
import { Hono } from "hono";
import { getStatusHandler } from "./getStatus";
import { getProfileHandler } from "./getProfile";
import { startJobHandler } from "./startJob";

export const gitAnalysisRoute = new Hono()
  .get("/:username", getStatusHandler)
  .get("/:username/profile", getProfileHandler)
  .post("/:username/start", startJobHandler);
```

### 4. Git分析状態API（新規）

**`src/routes/api/git-analysis/getStatus.ts`**

```typescript
import { Context } from "hono";
import { db } from "../../../utils/db";
import { eq } from "drizzle-orm";
import { jobTbl } from "@resume/db";

export const getStatusHandler = async (c: Context) => {
  const username = c.req.param("username");

  try {
    // データベースからユーザーの状態を取得
    const result = await db
      .select()
      .from(jobTbl)
      .where(eq(jobTbl.login, username));

    if (result.length === 0) {
      return c.json({ exists: false, message: "No Git analysis data found for this username" });
    }

    const job = result[0];
    const response: any = {
      exists: true,
      status: job.status,
      progress: job.progress,
      total_progress: calculateTotalProgress(job.status, job.progress),
      updated_at: job.updated_at,
    };

    // 完了状態の場合はレジュメも含める
    if (job.status === "COMPLETED" && job.resume) {
      response.resume = job.resume;
    }

    return c.json(response);
  } catch (error) {
    console.error("Error fetching job status:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

// 総合的な進捗状況を計算するヘルパー関数
function calculateTotalProgress(status: string, progress: number): number {
  // 各ステータスの重み（合計100%）
  const weights: Record<string, number> = {
    "SEARCHING": 10,
    "CLONING": 20,
    "ANALYZING": 40,
    "CREATING": 30,
    "COMPLETED": 0,
    "FAILED": 0
  };
  
  // 完了したステップの進捗
  let completedProgress = 0;
  
  // 現在のステップより前のステップは100%完了とみなす
  for (const step of Object.keys(weights)) {
    if (step === status) {
      // 現在のステップは、そのステップの重みに対する現在の進捗の割合
      return completedProgress + (weights[step] * progress / 100);
    }
    
    // 完了したステップの重みを加算
    completedProgress += weights[step];
  }
  
  // COMPLETED または FAILED の場合は100%
  return 100;
}
```

### 5. 1次分析API（新規）

**`src/routes/api/git-analysis/getProfile.ts`**

```typescript
import { Context } from "hono";
import { githubClient } from "../../../clients/github";

export const getProfileHandler = async (c: Context) => {
  const username = c.req.param("username");

  try {
    // GitHub APIからユーザープロフィール情報を取得
    const profile = await githubClient.getUserProfile(username);
    
    // 必要な情報を抽出して返却
    return c.json({
      login: profile.login,
      name: profile.name,
      avatar_url: profile.avatar_url,
      public_repos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      created_at: profile.created_at
    });
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    
    // GitHub APIからユーザーが見つからない場合
    if ((error as any).status === 404) {
      return c.json({ error: "GitHub user not found" }, 404);
    }
    
    return c.json({ error: "Internal server error" }, 500);
  }
};
```

### 6. 2次分析起動API（新規）

**`src/routes/api/git-analysis/startJob.ts`**

```typescript
import { Context } from "hono";
import { db } from "../../../utils/db";
import { cloudRunClient } from "../../../clients/cloudRun";
import { jobTbl } from "@resume/db";

export const startJobHandler = async (c: Context) => {
  const username = c.req.param("username");

  try {
    // データベースに初期状態を記録
    await db.insert(jobTbl).values({
      login: username,
      status: "SEARCHING",
      progress: 0,
    }).onConflictDoUpdate({
      target: jobTbl.login,
      set: {
        status: "SEARCHING",
        progress: 0,
        updated_at: new Date(),
      }
    });

    // Cloud Run Jobsを起動
    const jobId = await cloudRunClient.startJob(username);

    return c.json({
      status: "SEARCHING",
      progress: 0,
      message: "Analysis started",
      job_id: jobId
    });
  } catch (error) {
    console.error("Error starting job:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
```

### 7. データベース接続（新規）

**`src/utils/db.ts`**

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "./env";

// Neon.techへの接続
const sql = neon(env.RESUME_DB);
export const db = drizzle({ client: sql });
```

### 8. GitHub APIクライアント（新規）

**`src/clients/github.ts`**

```typescript
import { env } from "../utils";

class GitHubClient {
  private baseUrl = "https://api.github.com";
  private headers: HeadersInit;

  constructor() {
    this.headers = {
      "Accept": "application/vnd.github.v3+json",
      "Authorization": `token ${env.RESUME_GITHUB_TOKEN}`,
    };
  }

  async getUserProfile(username: string) {
    const response = await fetch(`${this.baseUrl}/users/${username}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      const error = new Error(`GitHub API error: ${response.statusText}`);
      (error as any).status = response.status;
      throw error;
    }

    return response.json();
  }
}

export const githubClient = new GitHubClient();
```

### 9. Cloud Run Jobsクライアント（新規）

**`src/clients/cloudRun.ts`**

```typescript
import { env } from "../utils";

class CloudRunClient {
  private projectId = env.RESUME_GCP_PROJECT_ID;
  private region = env.RESUME_GCP_REGION;
  private jobName = env.RESUME_JOB_NAME;

  async startJob(username: string): Promise<string> {
    // 実際の実装では、Google Cloud SDKを使用してCloud Run Jobsを起動します
    // ここでは簡略化のため、ジョブIDを生成して返します
    const jobId = `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    console.log(`Starting job for user ${username} with job ID ${jobId}`);
    
    // 実際の実装例:
    // const { CloudRunClient } = require('@google-cloud/run');
    // const client = new CloudRunClient();
    // const [job] = await client.runJob({
    //   name: `projects/${this.projectId}/locations/${this.region}/jobs/${this.jobName}`,
    //   overrides: {
    //     containerOverrides: [{
    //       env: [{ name: 'RESUME_USERNAME', value: username }]
    //     }]
    //   }
    // });
    
    return jobId;
  }
}

export const cloudRunClient = new CloudRunClient();
```

### 10. クライアントのエクスポート（新規）

**`src/clients/index.ts`**

```typescript
export * from "./github";
export * from "./cloudRun";
```

## 環境変数の追加

以下の環境変数を追加または更新する必要があります：

```
RESUME_DB=postgres://user:password@hostname:port/database
RESUME_GITHUB_TOKEN=your_github_token
RESUME_GCP_PROJECT_ID=your_gcp_project_id
RESUME_GCP_REGION=asia-northeast1
RESUME_JOB_NAME=resume-job
```

## 実装手順

1. 既存の`apps/api`ディレクトリ構造を確認
2. 上記のファイルを作成または修正
3. 必要な依存関係をインストール（`@neondatabase/serverless`, `drizzle-orm`, `@resume/db`など）
4. 環境変数を設定
5. ローカルでテスト
6. CloudFlare Workersにデプロイ

## 動作確認方法（cURLコマンド例）

### Git分析状態API

```bash
curl -X GET "http://localhost:3000/api/git-analysis/octocat"
```

### 1次分析API

```bash
curl -X GET "http://localhost:3000/api/git-analysis/octocat/profile"
```

### 2次分析起動API

```bash
curl -X POST "http://localhost:3000/api/git-analysis/octocat/start"
```