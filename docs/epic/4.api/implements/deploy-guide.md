# CloudFlare Workersデプロイガイド

このドキュメントでは、APIサーバーをCloudFlare Workersにデプロイするための詳細な手順を説明します。

## 前提条件

- CloudFlareアカウントが作成済みであること
- Node.js（v16以上）がインストール済みであること
- pnpmがインストール済みであること

## 1. Wrangler CLIのインストール

Wrangler CLIは、CloudFlare Workersの開発とデプロイに使用するコマンドラインツールです。

```bash
# グローバルにインストール
npm install -g wrangler

# または、pnpmを使用
pnpm add -g wrangler

# インストールの確認
wrangler --version
```

## 2. CloudFlareへのログイン

Wrangler CLIを使用してCloudFlareアカウントにログインします。

```bash
wrangler login
```

ブラウザが開き、CloudFlareアカウントへのアクセス許可を求められます。許可すると、CLIがアカウントにログインします。

## 3. wrangler.tomlの設定

プロジェクトのルートディレクトリに`wrangler.toml`ファイルを作成し、以下の内容を設定します。

```toml
name = "resume-api"
main = "src/index.ts"
compatibility_date = "2023-10-30"

# 開発環境用の設定
[vars]
RESUME_ENV = "dev"
RESUME_ALLOWED_ORIGIN = "localhost"
GCP_PROJECT_ID = "your-dev-project-id"
GCP_REGION = "asia-northeast1"
GCP_JOB_NAME = "resume-job"

# 本番環境用の設定
[env.production]
vars = { RESUME_ENV = "prd", RESUME_ALLOWED_ORIGIN = "your-domain.com" }
```

## 4. 環境変数（シークレット）の設定

機密情報は環境変数として設定します。Wrangler CLIを使用して、以下のシークレットを設定します。

```bash
# 開発環境用
wrangler secret put RESUME_DB
# プロンプトが表示されたら、Neon.techのデータベースURL（postgres://user:password@hostname:port/database）を入力

wrangler secret put RESUME_GITHUB_TOKEN
# プロンプトが表示されたら、GitHub APIトークンを入力

wrangler secret put GCP_SERVICE_ACCOUNT
# プロンプトが表示されたら、GCPサービスアカウントのJSONキーをそのまま貼り付け

# 本番環境用
wrangler secret put RESUME_DB --env production
wrangler secret put RESUME_GITHUB_TOKEN --env production
wrangler secret put GCP_SERVICE_ACCOUNT --env production
```

## 5. 依存関係の追加

APIサーバーの実装に必要な依存関係を追加します。

```bash
# プロジェクトディレクトリで実行
cd apps/api

# 依存関係の追加
pnpm add hono @hono/node-server
pnpm add @neondatabase/serverless drizzle-orm
pnpm add jose # JWT署名用

# 開発依存関係の追加
pnpm add -D wrangler @cloudflare/workers-types
```

## 6. package.jsonの更新

`package.json`ファイルに、CloudFlare Workers用のスクリプトを追加します。

```json
{
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "deploy:production": "wrangler deploy --env production"
  }
}
```

## 7. tsconfig.jsonの更新

`tsconfig.json`ファイルに、CloudFlare Workers用の設定を追加します。

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "lib": ["ES2020"],
    "types": ["@cloudflare/workers-types"],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 8. ローカル開発

Wrangler CLIを使用して、ローカル環境で開発とテストを行います。

```bash
# 開発サーバーの起動
pnpm dev

# ブラウザで http://localhost:8787 にアクセスして動作確認
```

## 9. デプロイ

開発環境と本番環境へのデプロイを行います。

```bash
# 開発環境へのデプロイ
pnpm deploy

# 本番環境へのデプロイ
pnpm deploy:production
```

デプロイが完了すると、CloudFlare Workersのダッシュボードで確認できます。また、デプロイURLが表示されます（例: `https://resume-api.your-account.workers.dev`）。

## 10. カスタムドメインの設定（オプション）

CloudFlareのダッシュボードから、カスタムドメインを設定できます。

1. CloudFlareダッシュボードにアクセス
2. 「Workers & Pages」を選択
3. デプロイしたWorkerを選択
4. 「トリガー」タブを選択
5. 「カスタムドメイン」セクションで「カスタムドメインを追加」をクリック
6. ドメイン名を入力して「追加」をクリック

## 11. デプロイ後の動作確認

デプロイ後、以下のcURLコマンドを使用して動作確認を行います。
```bash
# 1次分析(プロフィール取得)兼診断状況(結果含む)読込API
curl -X GET "https://resume-api.your-account.workers.dev/api/github/octocat"

# 2次分析実行API
curl -X POST "https://resume-api.your-account.workers.dev/api/github/octocat/analyze"
```
```

## 12. トラブルシューティング

### 12.1 デプロイエラー

デプロイ中にエラーが発生した場合は、以下を確認してください：

- `wrangler.toml`の設定が正しいか
- 必要な環境変数（シークレット）が設定されているか
- TypeScriptのコンパイルエラーがないか

### 12.2 ランタイムエラー

デプロイ後にAPIが正しく動作しない場合は、以下を確認してください：

- CloudFlareダッシュボードの「Workers & Pages」→「resume-api」→「ログ」でエラーログを確認
- 環境変数が正しく設定されているか
- 外部サービス（Neon.tech、GitHub API、GCP）への接続が正しく設定されているか

### 12.3 CORS関連のエラー

CORS関連のエラーが発生した場合は、以下を確認してください：

- `RESUME_ALLOWED_ORIGIN`環境変数が正しく設定されているか
- フロントエンドのオリジンが許可リストに含まれているか

## 参考リンク

- [CloudFlare Workers ドキュメント](https://developers.cloudflare.com/workers/)
- [Wrangler CLI ドキュメント](https://developers.cloudflare.com/workers/wrangler/)
- [Hono.js ドキュメント](https://hono.dev/)
- [CloudFlare Workers TypeScript Types](https://github.com/cloudflare/workers-types)