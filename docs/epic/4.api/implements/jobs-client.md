# Cloudflare WorkersからCloud Run Jobs APIを実行する実装ガイド

このドキュメントでは、Cloudflare WorkersからGoogle Cloud Platform (GCP)のCloud Run Jobs APIを実行するための詳細な実装方法を説明します。

## 前提条件

- GCPプロジェクトが作成済みであること
- Cloud Run Jobsが設定済みであること
- GCPサービスアカウントが作成済みであること
- Cloudflare Workersのアカウントがあること

## 1. GCPサービスアカウントの設定

### 1.1 サービスアカウントの作成

まだサービスアカウントを作成していない場合は、GCPコンソールから作成します。

1. [GCPコンソール](https://console.cloud.google.com/)にアクセス
2. 「IAMと管理」→「サービスアカウント」を選択
3. 「サービスアカウントを作成」をクリック
4. 名前を入力（例: `cloudflare-worker-sa`）
5. 「作成して続行」をクリック
6. 以下の役割を付与:
   - Cloud Run 管理者 (`roles/run.admin`)
   - Cloud Run 起動者 (`roles/run.invoker`)
7. 「完了」をクリック

### 1.2 サービスアカウントキー（JSON）の作成

1. 作成したサービスアカウントの詳細ページに移動
2. 「キー」タブを選択
3. 「鍵を追加」→「新しい鍵を作成」をクリック
4. キーのタイプとして「JSON」を選択
5. 「作成」をクリックしてJSONキーファイルをダウンロード

## 2. Cloudflare Workersの設定

### 2.1 サービスアカウントキーの登録

Cloudflare WorkersでGCP APIを呼び出すには、サービスアカウントキーを環境変数として登録する必要があります。

1. [Cloudflareダッシュボード](https://dash.cloudflare.com/)にアクセス
2. 「Workers & Pages」を選択
3. 対象のWorkerを選択
4. 「設定」タブ→「環境変数」を選択
5. 「環境変数を追加」をクリック
6. 変数名に `GCP_SERVICE_ACCOUNT` を入力
7. 値にダウンロードしたJSONキーファイルの内容をそのまま貼り付け
8. 「暗号化」オプションを有効にして「保存」をクリック

### 2.2 その他の環境変数の設定

以下の環境変数も設定します:

- `GCP_PROJECT_ID`: GCPプロジェクトID
- `GCP_REGION`: Cloud Run Jobsがデプロイされているリージョン（例: `asia-northeast1`）
- `GCP_JOB_NAME`: 実行するCloud Run Jobの名前

## 3. Cloud Run Jobs APIクライアントの実装

以下に、Cloudflare WorkersからCloud Run Jobs APIを呼び出すためのクライアント実装を示します。

### 3.1 Google認証トークンの取得

```typescript
// src/clients/gcp-auth.ts

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  project_id: string;
}

export async function getGoogleAuthToken(): Promise<string> {
  try {
    // 環境変数からサービスアカウントキーを取得
    const serviceAccountJson = JSON.parse(
      (process.env.GCP_SERVICE_ACCOUNT as string) || '{}'
    ) as ServiceAccountKey;

    // JWTヘッダーの作成
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    // 現在時刻と有効期限の設定
    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 3600; // 1時間

    // JWTクレームの作成
    const claim = {
      iss: serviceAccountJson.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: expiry,
      iat: now,
    };

    // JWTの署名
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedClaim = btoa(JSON.stringify(claim));
    const signatureInput = `${encodedHeader}.${encodedClaim}`;

    // 署名の作成（注: Cloudflare Workersでは外部ライブラリが必要）
    // ここでは簡略化のため、WebCryptoAPIを使用した例を示します
    const privateKey = serviceAccountJson.private_key;
    const encoder = new TextEncoder();
    const signatureBytes = encoder.encode(signatureInput);
    
    // 実際の実装では、以下のようなライブラリを使用します
    // const signature = await signWithRSA(privateKey, signatureBytes);
    // const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
    
    // 簡略化のため、ここでは外部ライブラリを使用すると仮定
    const encodedSignature = await signWithRSA(privateKey, signatureInput);
    
    // JWTの作成
    const jwt = `${encodedHeader}.${encodedClaim}.${encodedSignature}`;

    // トークンの取得
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get auth token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Google auth token:', error);
    throw error;
  }
}

// 注: 実際の実装では、RSA署名のためのライブラリが必要です
// Cloudflare Workersでは、以下のようなライブラリが使用できます:
// - jose: https://github.com/panva/jose
// - subtle-crypto: https://developers.cloudflare.com/workers/runtime-apis/web-crypto/
async function signWithRSA(privateKey: string, data: string): Promise<string> {
  // 実際の実装では、ここにRSA署名のコードが入ります
  // 例: joseライブラリを使用した実装
  return 'encoded_signature_placeholder';
}
```

### 3.2 Cloud Run Jobs APIクライアントの実装

```typescript
// src/clients/cloudRun.ts

import { getGoogleAuthToken } from './gcp-auth';

interface JobExecutionOptions {
  env?: Record<string, string>;
  timeout?: string; // 例: '3600s'
  serviceAccount?: string;
}

export class CloudRunClient {
  private projectId: string;
  private region: string;
  private jobName: string;

  constructor() {
    this.projectId = process.env.GCP_PROJECT_ID || '';
    this.region = process.env.GCP_REGION || 'asia-northeast1';
    this.jobName = process.env.GCP_JOB_NAME || '';
  }

  /**
   * Cloud Run Jobを実行します
   * @param username GitHub User名
   * @param options ジョブ実行オプション
   * @returns ジョブ実行ID
   */
  async startJob(username: string, options: JobExecutionOptions = {}): Promise<string> {
    try {
      // 認証トークンの取得
      const token = await getGoogleAuthToken();

      // 環境変数の設定
      const envVars = [
        {
          name: 'RESUME_USERNAME',
          value: username
        },
        // 追加の環境変数があれば設定
        ...Object.entries(options.env || {}).map(([name, value]) => ({
          name,
          value
        }))
      ];

      // リクエストボディの作成
      const body = {
        overrides: {
          containerOverrides: [
            {
              env: envVars
            }
          ]
        },
        // タイムアウトが指定されていれば設定
        ...(options.timeout ? { timeout: options.timeout } : {}),
        // サービスアカウントが指定されていれば設定
        ...(options.serviceAccount ? { serviceAccount: options.serviceAccount } : {})
      };

      // Cloud Run Jobs APIを呼び出し
      const response = await fetch(
        `https://${this.region}-run.googleapis.com/v1/projects/${this.projectId}/locations/${this.region}/jobs/${this.jobName}:run`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start job: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      // ジョブ実行IDを返却
      // 形式: "projects/{project}/locations/{location}/jobs/{job}/executions/{execution}"
      const executionPath = data.name;
      const executionId = executionPath.split('/').pop();
      
      return executionId;
    } catch (error) {
      console.error('Error starting Cloud Run Job:', error);
      throw error;
    }
  }

  /**
   * ジョブの実行状態を取得します
   * @param executionId ジョブ実行ID
   * @returns ジョブ実行状態
   */
  async getJobStatus(executionId: string): Promise<any> {
    try {
      // 認証トークンの取得
      const token = await getGoogleAuthToken();

      // Cloud Run Jobs APIを呼び出し
      const response = await fetch(
        `https://${this.region}-run.googleapis.com/v1/projects/${this.projectId}/locations/${this.region}/jobs/${this.jobName}/executions/${executionId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get job status: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error getting job status:', error);
      throw error;
    }
  }
}

export const cloudRunClient = new CloudRunClient();
```

### 3.3 クライアントの使用例

```typescript
// src/routes/api/research/startJob.ts

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
    const jobId = await cloudRunClient.startJob(username, {
      // オプションの指定例
      env: {
        RESUME_ENV: process.env.RESUME_ENV || 'dev'
      },
      timeout: '3600s' // 1時間
    });

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

## 4. 必要なパッケージのインストール

Cloudflare WorkersでJWT署名を行うために、以下のパッケージをインストールします：

```bash
npm install jose
# または
pnpm add jose
```

## 5. wrangler.tomlの設定

Cloudflare Workersの設定ファイル（wrangler.toml）に環境変数を定義します：

```toml
name = "resume-api"
main = "src/index.ts"
compatibility_date = "2023-10-30"

[vars]
GCP_PROJECT_ID = "your-project-id"
GCP_REGION = "asia-northeast1"
GCP_JOB_NAME = "resume-job"

# 本番環境用の設定
[env.production]
GCP_PROJECT_ID = "your-production-project-id"
GCP_REGION = "asia-northeast1"
GCP_JOB_NAME = "resume-job"
```

## 6. 注意事項

### 6.1 サービスアカウントキーのセキュリティ

- サービスアカウントキーは機密情報であり、適切に保護する必要があります
- Cloudflare Workersの環境変数として設定する際は、必ず「暗号化」オプションを有効にしてください
- 定期的にサービスアカウントキーをローテーションすることをお勧めします

### 6.2 権限の最小化

- サービスアカウントには必要最小限の権限のみを付与してください
- 本番環境では、特定のCloud Run Jobのみを実行できるように権限を制限することを検討してください

### 6.3 エラーハンドリング

- 認証エラーやAPI呼び出しエラーを適切に処理してください
- エラーログを記録し、問題の診断に役立てましょう

## 7. 参考リンク

- [Cloud Run Jobs API リファレンス](https://cloud.google.com/run/docs/reference/rest/v1/projects.locations.jobs)
- [Google Cloud認証ガイド](https://cloud.google.com/docs/authentication/getting-started)
- [Cloudflare Workers ドキュメント](https://developers.cloudflare.com/workers/)
- [jose ライブラリ（JWT実装用）](https://github.com/panva/jose)
- [Cloudflare Workers Secrets](https://developers.cloudflare.com/workers/platform/environment-variables/)