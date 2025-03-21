# プロジェクトの重要なドキュメント一覧

**更新日**: 2025/3/21
**確認日**: 2025/3/21

このファイルは、git-resumeプロジェクト内の重要なドキュメントや場所を一覧化し、プロジェクトの全体像を把握するためのガイドです。Clineがプロジェクトを効率的に理解し、参照すべき資料を簡単に見つけられるようにしています。

## プロジェクト概要ドキュメント

- [README.md](/README.md) - プロジェクトの概要説明
- [docs/guide/project-overview.md](/docs/guide/project-overview.md) - プロジェクトの詳細な概要と目的
- [docs/guide/onboarding.md](/docs/guide/onboarding.md) - 新規開発者向けのセットアップガイド
- [docs/guide/roadmap.md](/docs/guide/roadmap.md) - プロジェクトの開発ロードマップ
- [docs/guide/development-flow.md](/docs/guide/development-flow.md) - 開発フローとドキュメント作成のタイミング

## ユーザー向けドキュメント

- [docs/user-guide/README.md](/docs/user-guide/README.md) - 一般ユーザー向けの操作方法や機能説明
  - CLI、Web、APIの各インターフェースの利用方法
  - レジュメ生成や管理のワークフロー
  - 各種機能の詳細説明
- [docs/troubleshooting/README.md](/docs/troubleshooting/README.md) - 一般的な問題とその解決方法
  - 環境変数、GitHub連携、CLI、Webアプリケーション、レジュメ生成の問題解決
  - 開発環境のトラブルシューティング
- [docs/releases/CHANGELOG.md](/docs/releases/CHANGELOG.md) - バージョンごとの変更点や新機能の説明
  - リリースバージョン履歴（v0.1.0、v0.2.0）
  - 開発中の機能と今後の計画
  - 各バージョンの開発要件

## アーキテクチャと設計

- [docs/architecture/overview.md](/docs/architecture/overview.md) - システム構成、コンポーネント間の関係、技術スタック
  - モノレポ構造の解説
  - コンポーネント間のデータフロー図
  - レジュメ生成プロセスフロー
  - Server-Sent Events (SSE) の実装
  - 使用技術スタックの詳細
- [docs/architecture/data-models.md](/docs/architecture/data-models.md) - データモデルと関連性の説明
  - 主要データモデル（User、Repository、Resume、Pack、Summary、Events）
  - モデル関連図とその説明
  - 実装上の考慮事項
- [docs/api/README.md](/docs/api/README.md) - API仕様書
  - エンドポイント（getUser、getUserSse）の詳細
  - リクエスト/レスポンス形式
  - 内部処理フロー
  - エラー処理
- [docs/ADR/](/docs/ADR/) - アーキテクチャ決定記録
  - [docs/ADR/001-spa-mode/README.md](/docs/ADR/001-spa-mode/README.md) - SPAモードに関する設計決定
- [docs/templates/prd-template.md](/docs/templates/prd-template.md) - Product Requirement Document テンプレート
- [docs/templates/tech-template.md](/docs/templates/tech-template.md) - Technical Design Document テンプレート

## ドキュメント作成の参考例

- [docs/templates/example-feature/](/docs/templates/example-feature/) - 機能開発ドキュメントの包括的な参考例
  - [docs/templates/example-feature/README.md](/docs/templates/example-feature/README.md) - 機能概要と全ドキュメントの索引
  - [docs/templates/example-feature/PRD/](/docs/templates/example-feature/PRD/) - 要件定義書の例
  - [docs/templates/example-feature/Technical-Design/](/docs/templates/example-feature/Technical-Design/) - 技術設計書の例（サブディレクトリ構造）
  - [docs/templates/example-feature/Release/](/docs/templates/example-feature/Release/) - リリース計画の例
  - [docs/templates/example-feature/User-Guide/](/docs/templates/example-feature/User-Guide/) - ユーザーガイドの例

## アプリケーション

git-resumeは以下の主要アプリケーションで構成されています：

- [apps/api/](/apps/api/) - バックエンドAPI
  - [apps/api/README.md](/apps/api/README.md) - APIの概要と使用方法
  - [apps/api/src/routes/](/apps/api/src/routes/) - APIエンドポイントの定義
  - [apps/api/src/routes/api/github/](/apps/api/src/routes/api/github/) - GitHubユーザー情報取得とレジュメ生成エンドポイント

- [apps/cli/](/apps/cli/) - コマンドラインインターフェース
  - [apps/cli/README.md](/apps/cli/README.md) - CLIの概要と使用方法
  - [apps/cli/src/commands/](/apps/cli/src/commands/) - CLIコマンドの実装
  - [apps/cli/src/commands/clone/](/apps/cli/src/commands/clone/) - リポジトリのクローン機能
  - [apps/cli/src/commands/pack/](/apps/cli/src/commands/pack/) - リポジトリのパッケージ化機能
  - [apps/cli/src/commands/summary/](/apps/cli/src/commands/summary/) - サマリー生成機能
  - [apps/cli/src/commands/resume/](/apps/cli/src/commands/resume/) - レジュメ生成機能

- [apps/web/](/apps/web/) - Webフロントエンド
  - [apps/web/README.md](/apps/web/README.md) - Webアプリの概要と使用方法
  - [apps/web/app/](/apps/web/app/) - フロントエンドのソースコード
  - [apps/web/app/routes/](/apps/web/app/routes/) - Reactルーター定義
  - [apps/web/app/routes/github.$userId.tsx](/apps/web/app/routes/github.$userId.tsx) - レジュメ生成と表示のメインコンポーネント

## 共有パッケージ

- [packages/models/](/packages/models/) - データモデル定義
  - [packages/models/README.md](/packages/models/README.md) - モデルの概要と構造
  - [packages/models/src/](/packages/models/src/) - モデル定義の実装
  - [packages/models/src/events.ts](/packages/models/src/events.ts) - SSEイベント型定義
  - [packages/models/src/user.ts](/packages/models/src/user.ts) - ユーザーモデル
  - [packages/models/src/repository.ts](/packages/models/src/repository.ts) - リポジトリモデル
  - [packages/models/src/pack.ts](/packages/models/src/pack.ts) - パッケージモデル
  - [packages/models/src/resume.ts](/packages/models/src/resume.ts) - レジュメモデル
  - [packages/models/src/sumary.ts](/packages/models/src/sumary.ts) - サマリーモデル

- [packages/services/](/packages/services/) - 共通サービス機能
  - [packages/services/README.md](/packages/services/README.md) - サービスの概要と使用方法
  - [packages/services/src/github/](/packages/services/src/github/) - GitHub連携サービス
  - [packages/services/src/git/](/packages/services/src/git/) - Git操作サービス
  - [packages/services/src/pack/](/packages/services/src/pack/) - パッケージ関連サービス
  - [packages/services/src/resume/](/packages/services/src/resume/) - レジュメ生成サービス
  - [packages/services/src/summary/](/packages/services/src/summary/) - サマリー生成サービス

- [packages/utils/](/packages/utils/) - ユーティリティ関数
  - [packages/utils/README.md](/packages/utils/README.md) - ユーティリティの概要と使用方法

## インフラストラクチャ

- [infra/](/infra/) - インフラストラクチャ定義（Terraform）
  - [infra/README.md](/infra/README.md) - インフラの概要とセットアップ方法
  - [infra/environments/](/infra/environments/) - 環境ごとの設定

## 開発関連ファイル

- [package.json](/package.json) - ルートパッケージ設定
- [turbo.json](/turbo.json) - Turborepoの設定
- [biome.jsonc](/biome.jsonc) - Biomeの設定（リント・フォーマット）
- [.gitignore](/.gitignore) - Gitの除外設定
- [.npmrc](/.npmrc) - npm設定
- [.env.sample](/.env.sample) - 環境変数サンプル

## .clinerules ガイドライン

- [.clinerules/README.md](/.clinerules/README.md) - .clinerules全体の目次
- [.clinerules/important-docs.md](/.clinerules/important-docs.md) - 重要な資料の場所をまとめたリスト（本ファイル）
- [.clinerules/commit-rules.md](/.clinerules/commit-rules.md) - プロンプト履歴の記録ルール
- [.clinerules/repomix.md](/.clinerules/repomix.md) - リポジトリコード効率的理解の方法
- [.clinerules/documentation-guide.md](/.clinerules/documentation-guide.md) - ドキュメンテーションガイド
- [.clinerules/prompts/update-docs.md](/.clinerules/prompts/update-docs.md) - ドキュメント更新時のルールとテンプレート

## Changelog

- 2025/3/21: .clinerules ガイドラインセクションを追加し、documentation-guide.mdを参照に追加
- 2025/3/21: ユーザー向けドキュメント、アーキテクチャドキュメント、API仕様書を充実化
- 2025/3/21: 実際の実装に基づいて各ドキュメントを更新
- 2025/3/21: アプリケーションの詳細構成と主要ファイルへの参照を追加
- 2025/3/21: 機能開発ドキュメントの包括的な参考例を追加
- 2025/3/21: 新規作成した開発ロードマップとテンプレートドキュメントを追加
- 2025/3/21: 初回作成
