# git-resume 開発者向けセットアップガイド

**更新日**: 2025/3/21
**確認日**: 2025/3/21

このドキュメントは、git-resumeプロジェクトの開発環境セットアップ方法や開発フロー、ベストプラクティスをまとめたものです。新しく参加する開発者向けの案内として活用してください。

## 前提条件

以下のツールが開発環境にインストールされていることを確認してください：

- **Node.js**: v22.x以上（volta等の利用を推奨）
- **pnpm**: v10.4.1以上
- **Git**: 最新版
- **VSCode**: 推奨エディタ（設定ファイルが含まれています）

## 開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/ToyB0x/git-resume.git
cd git-resume
```

### 2. 依存パッケージのインストール

```bash
pnpm install
```

### 3. 環境変数の設定

`.env.sample`ファイルをコピーして、必要な環境変数を設定します。

```bash
cp .env.sample .env
```

`.env`ファイルを開き、GitHub API TokenなどのSAMPLEを実際の値に置き換えてください。

### 4. 開発サーバーの起動

```bash
# フロントエンド (Web)
pnpm dev --filter=web

# バックエンド (API)
pnpm dev --filter=api

# すべてのアプリケーションを同時に起動
pnpm dev
```

## プロジェクト構造

git-resumeはTurborepoを使用したモノレポ構造になっています。

```
git-resume/
├── apps/           # アプリケーション
│   ├── api/        # バックエンドAPI
│   ├── cli/        # CLIツール
│   └── web/        # Webフロントエンド
├── packages/       # 共有パッケージ
│   ├── models/     # データモデル
│   ├── services/   # サービス機能
│   └── utils/      # ユーティリティ
└── infra/          # インフラストラクチャ設定
```

## 開発ワークフロー

### ブランチ戦略

- `main`: リリース用ブランチ
- `develop`: 開発用ブランチ
- `feature/*`: 新機能開発用ブランチ
- `fix/*`: バグ修正用ブランチ
- `docs/*`: ドキュメント更新用ブランチ

### コミットメッセージ

コミットメッセージは[コミットルール](./.clinerules/commit-rules.md)に従ってください。

例：
```
feat(web): ユーザーダッシュボードの実装
```

### テスト

変更を加える前にテストを実行し、すべてのテストが成功することを確認してください。

```bash
# すべてのパッケージとアプリでテストを実行
pnpm test

# 特定のパッケージでテストを実行
pnpm test --filter=models
```

### 型チェック

```bash
pnpm typecheck
```

### リンティング

```bash
# リントチェック
pnpm lint

# 自動修正
pnpm lint:fix
```

## デプロイメント

### ステージング環境へのデプロイ

`develop`ブランチへのマージ時に自動的にステージング環境にデプロイされます。

### 本番環境へのデプロイ

`main`ブランチへのマージ時に自動的に本番環境にデプロイされます。

## トラブルシューティング

### 一般的な問題

1. **pnpm installで依存関係エラーが発生する場合**
   ```bash
   rm -rf node_modules
   rm -rf **/node_modules
   pnpm install
   ```

2. **TypeScriptの型エラーが発生する場合**
   ```bash
   pnpm typecheck
   ```
   エラーメッセージを確認し、必要な型定義を修正してください。

3. **開発サーバーが起動しない場合**
   - ポートが既に使用されていないか確認してください
   - 環境変数が正しく設定されているか確認してください

## 関連ドキュメント

- [プロジェクト概要](./project-overview.md) - プロジェクトの目的と構成
- [重要なドキュメント一覧](./.clinerules/important-docs.md) - プロジェクト関連ドキュメントの一覧

## サポート

質問や問題がある場合は、GitHubのIssueを作成するか、Slackチャンネル `#git-resume-dev` で質問してください。

## Changelog

- 2025/3/21: 初回作成
