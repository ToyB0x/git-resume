# GitHub分析ジョブアーキテクチャ設計

## 概要

このドキュメントは、Deep Researchシステムの2次調査アーキテクチャにおけるCloudRun Jobsの詳細設計を説明するものです。GitHub User名を入力した後、バックグラウンドで実行される詳細な分析処理（2次調査）のアーキテクチャと実装方針を定義しています。

## 2次調査アーキテクチャの詳細

### 目的と特性

- GitHubの詳細情報収集、リポジトリ分析、AIによるレジュメ生成
- 重い処理のため、結果を30日間キャッシュして再利用
- ユーザーがいつでも離脱できるバックグラウンド処理

### 技術構成

- **本番環境**:
  - **実行環境**: GCP Cloud Run Jobs（サーバーレス、スケーラビリティ）
  - **処理管理**: 内蔵キュー管理（追加インフラ不要）
  - **データ永続化**: Neon.tech（PostgreSQL互換、サーバーレス）
  - **CI/CD**: CloudBuild、ArtifactRegistry

- **ローカル開発環境**:
  - **実行環境**: CLIコマンド実行（Cloud Run Jobsではなく直接コマンド実行）
  - **データベース**: Neon.tech（PostgreSQL互換、サーバーレス）
  - **ORM**: Drizzle（TypeScript型安全なSQLビルダー）

- **共通**:
  - **言語・フレームワーク**: TypeScript、Node.js
  - **ライブラリ**:
    - Commander.js（CLIコマンド）
    - @supercharge/promise-pool（並列処理）
    - Gemini API（AI分析）

### 詳細分析パイプライン

```mermaid
graph TD
    A[調査開始] --> B[リポジトリを検索中]
    B --> C[リポジトリをClone中]
    C --> D[リポジトリの活動を分析中]
    D --> E[Resumeの作成中]
    E --> F[Resume作成済み]
    
    subgraph "Cloud Run Jobs"
    A
    B
    C
    D
    E
    F
    end
```

処理パイプラインは以下のステップで構成されています：

1. **リポジトリ検索**: ユーザがCommitしたリポジトリの検索
   - GitHub REST APIを使用
   - 過去1年分のリポジトリを検索
   - 検索結果をフィルタリング

2. **リポジトリClone**: 検索結果に基づきリポジトリをClone
   - Gitコマンドを使用したクローン処理
   - 一時ディレクトリへの保存

3. **Commit抽出**: ユーザのCommitのみを抽出しpack
   - Gitコマンドを使用したユーザーのCommit抽出
   - コミットメタデータの収集

4. **AI要約**: リポジトリごとの活動サマリを生成
   - Gemini APIを使用
   - リポジトリの言語、コミット内容の分析

5. **AI横断分析**: 複数サマリからマークダウン形式のResumeを生成
   - Gemini APIを使用
   - スキルと経験の抽出
   - マークダウン形式のレジュメ生成

### コマンド構造設計

```
job
└── run
    └── github <login>
```

このコマンドは、指定されたGitHubユーザー名に対して、リポジトリの検索、クローン、分析、レジュメ生成までの一連の処理を実行します。内部的には各ステップが順番に実行され、エラーが発生した場合は適切にハンドリングされます。

### ローカル開発環境のセットアップ

ローカル開発環境では、以下のセットアップを行います：

1. **Neon.techのセットアップ**:
   - Neon.techでプロジェクトを作成（開発用）
   - データベースとブランチを作成
   - 接続情報を取得

2. **Drizzle ORMの設定**:
   - スキーマ定義
   - マイグレーションファイルの生成
   - TypeScript型の生成

3. **環境変数の設定**:
   - Neon.tech接続情報
   - GitHub API トークン
   - Gemini API キー

4. **ジョブコマンドの実行**:
   - `pnpm job run github <login>`で直接実行

### 進捗管理設計

進捗状態は以下のように定義され、データベースに記録されます：

```typescript
export const jobStatuses = [
  "SEARCHING", // リポジトリを検索中
  "CLONING",   // リポジトリをClone中
  "ANALYZING", // リポジトリの活動を分析中
  "CREATING",  // Resumeの作成中
  "COMPLETED", // Resume作成済み
  "FAILED",    // 処理失敗
] as const;
```

進捗情報には以下の情報が含まれます：

- 現在のステータス（上記のいずれか）
- 進捗率（0-100%）
- タイムスタンプ（作成日時、更新日時）

データベースクライアントは以下の操作を提供します：

- `upsertStatus`: ユーザーの状態を作成または更新
- `updateStatus`: ステータスを更新
- `updateProgress`: 進捗率を更新
- `addResume`: 生成されたレジュメを保存

### データベーススキーマ設計

Drizzleを使用して以下のスキーマを定義します：

```typescript
// job テーブル
export const jobTbl = pgTable("job", {
  id: uuid().defaultRandom().primaryKey(),
  login: varchar({ length: 24 }).notNull().unique(),
  status: text({ enum: jobStatuses }),
  progress: integer("progress").notNull().default(0),
  resume: text("resume"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// 型定義
export type Job = typeof jobTbl.$inferSelect;
export type NewJob = typeof jobTbl.$inferInsert;
```

### エラーハンドリング設計

エラーハンドリングは以下の方針で実装します：

1. **リトライ機能**: 一時的なエラー（ネットワークエラーなど）に対するリトライ
2. **部分的成功**: 一部のリポジトリが失敗しても、他のリポジトリの処理は継続
3. **エラーログ**: 詳細なエラー情報のログ記録
4. **状態管理**: エラー発生時の状態をデータベースに記録
5. **通知**: 重大なエラー発生時の通知機能

### スケーラビリティ設計

スケーラビリティを確保するための設計方針：

1. **並列処理**: リポジトリのCloneと分析を並列に実行
2. **リソース最適化**: メモリと処理時間の効率的な使用
3. **大規模リポジトリ対応**: 部分クローンと分割処理
4. **トークン制限対応**: AI APIのトークン制限に対応した分割処理
5. **自動スケーリング**: Cloud Run Jobsの自動スケーリング機能の活用

## APIエンドポイント設計

APIエンドポイントの実装は次のエピックで行われる予定です。

## CI/CDとデプロイメント設計

### CloudBuild経由のデプロイメント

CloudBuild、ArtifactRegistry、Cloud Run Jobsを連携させたCI/CDパイプラインを構築します：

```mermaid
graph TD
    A[Git Push] --> B[CloudBuild Trigger]
    B --> C[CloudBuild Pipeline]
    C --> D[Build Docker Image]
    D --> E[Push to ArtifactRegistry]
    E --> F[Deploy to Cloud Run Jobs]
```

1. **CloudBuild Trigger設定**:
   - Terraformを使用してCloudBuild Triggerを設定
   - 特定のブランチ（main, develop）へのプッシュでトリガー
   - cloudbuild.ymlファイルを読み込んでビルドパイプラインを実行

2. **cloudbuild.yml設計**:
   ```yaml
   steps:
     # ビルド前の準備
     - name: 'gcr.io/cloud-builders/npm'
       args: ['install', '-g', 'pnpm@latest-10']
     - name: 'gcr.io/cloud-builders/npm'
       args: ['run', 'pnpm', 'install']
     
     # テスト実行
     - name: 'gcr.io/cloud-builders/npm'
       args: ['run', 'pnpm', 'test']
     
     # Dockerイメージのビルド
     - name: 'gcr.io/cloud-builders/docker'
       args: ['build', '-t', '${_REGION}-docker.pkg.dev/${PROJECT_ID}/${_REPOSITORY}/${_IMAGE}:${_TAG}', '-f', 'apps/job/Dockerfile', '.']
     
     # ArtifactRegistryへのプッシュ
     - name: 'gcr.io/cloud-builders/docker'
       args: ['push', '${_REGION}-docker.pkg.dev/${PROJECT_ID}/${_REPOSITORY}/${_IMAGE}:${_TAG}']
     
     # Cloud Run Jobsへのデプロイ
     - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
       entrypoint: 'gcloud'
       args:
         - 'run'
         - 'jobs'
         - 'update'
         - '${_JOB_NAME}'
         - '--image=${_REGION}-docker.pkg.dev/${PROJECT_ID}/${_REPOSITORY}/${_IMAGE}:${_TAG}'
         - '--region=${_REGION}'
         - '--memory=${_MEMORY}'
         - '--timeout=${_TIMEOUT}'
         - '--max-retries=${_MAX_RETRIES}'
         - '--set-env-vars=RESUME_ENV=${_ENV},RESUME_USERNAME=${_RESUME_USERNAME}'
         - '--set-secrets=GITHUB_TOKEN=github-token:latest,RESUME_GEMINI_API_KEY=gemini-api-key:latest'
   
   substitutions:
     _REGION: 'asia-northeast1'
     _REPOSITORY: 'resume-jobs'
     _IMAGE: 'resume-job'
     _TAG: '${COMMIT_SHA}'
     _JOB_NAME: 'resume-job'
     _MEMORY: '2Gi'
     _TIMEOUT: '3600s'
     _MAX_RETRIES: '3'
     _ENV: 'prd'
     _RESUME_USERNAME: 'system'
   
   options:
     logging: CLOUD_LOGGING_ONLY
   ```

3. **Terraform設定**:
   - ArtifactRegistryリポジトリの作成
   - CloudBuild Triggerの設定
   - Cloud Run Jobsの設定
   - Secret Managerでの機密情報管理

4. **環境別設定**:
   - 開発環境（dev）、ステージング環境（stg）、本番環境（prd）の設定
   - 環境変数の切り替え
   - リソース割り当ての調整

### データベース接続設定

Neon.techへの接続設定：

1. **Drizzleセットアップ**:
   ```typescript
   // drizzle.config.ts
   import type { Config } from 'drizzle-kit';
   
   export default {
     schema: './src/schema.ts',
     out: './drizzle',
     driver: 'pg',
     dbCredentials: {
       connectionString: process.env.DATABASE_URL || '',
     },
   } satisfies Config;
   ```

2. **環境変数設定**:
   ```
   # .env
   DATABASE_URL=postgres://user:password@hostname:port/database
   GITHUB_TOKEN=your_github_token
   RESUME_GEMINI_API_KEY=your_gemini_api_key
   ```

3. **データベース接続コード**:
   ```typescript
   // db.ts
   import { drizzle } from 'drizzle-orm/postgres-js';
   import postgres from 'postgres';
   
   const connectionString = process.env.DATABASE_URL || '';
   const client = postgres(connectionString);
   export const db = drizzle(client);
   ```

## 今後の展望

監視設計、セキュリティ強化、機能拡張などは次のエピックで検討・実装予定です。