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

## アーキテクチャと設計

- [docs/ADR/](/docs/ADR/) - アーキテクチャ決定記録（Architecture Decision Records）
- [docs/ADR/001-spa-mode/README.md](/docs/ADR/001-spa-mode/README.md) - SPAモードに関する設計決定
- [docs/templates/prd-template.md](/docs/templates/prd-template.md) - Product Requirement Document テンプレート
- [docs/templates/tech-template.md](/docs/templates/tech-template.md) - Technical Design Document テンプレート

## アプリケーション

git-resumeは以下の主要アプリケーションで構成されています：

- [apps/api/](/apps/api/) - バックエンドAPI
  - [apps/api/README.md](/apps/api/README.md) - APIの概要と使用方法
  - [apps/api/src/routes/](/apps/api/src/routes/) - APIエンドポイントの定義

- [apps/cli/](/apps/cli/) - コマンドラインインターフェース
  - [apps/cli/README.md](/apps/cli/README.md) - CLIの概要と使用方法
  - [apps/cli/src/commands/](/apps/cli/src/commands/) - CLIコマンドの実装

- [apps/web/](/apps/web/) - Webフロントエンド
  - [apps/web/README.md](/apps/web/README.md) - Webアプリの概要と使用方法
  - [apps/web/app/](/apps/web/app/) - フロントエンドのソースコード

## 共有パッケージ

- [packages/models/](/packages/models/) - データモデル定義
  - [packages/models/README.md](/packages/models/README.md) - モデルの概要と構造
  - [packages/models/src/](/packages/models/src/) - モデル定義の実装

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

## Changelog

- 2025/3/21: 新規作成した開発ロードマップとテンプレートドキュメントを追加
- 2025/3/21: 初回作成
