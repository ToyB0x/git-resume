# git-resume

**更新日**: 2025/3/21
**確認日**: 2025/3/21

git-resumeは、エンジニアのキャリア管理と成長をサポートするアプリケーションです。GitHubの活動履歴からレジュメを自動生成し、キャリアプランの策定、自己マーケティング戦略の開発と実行状況のモニタリングを支援します。また、時代のトレンドに合わせた行動指針を提案し、エンジニアとしての生存戦略をサポートします。

## 目次

- [主要機能](#主要機能)
- [プロジェクト構成](#プロジェクト構成)
- [インストールと開発環境のセットアップ](#インストールと開発環境のセットアップ)
- [使用方法](#使用方法)
- [Clineでの開発](#clineでの開発)

## 主要機能

- **GitHub活動分析**: GitHubのコミット履歴、リポジトリ、PR活動などを分析
- **レジュメ自動生成**: 分析結果からプロフェッショナルなレジュメを作成
- **キャリアプランニング**: 個人のスキルと市場動向に基づいたキャリア戦略の提案
- **自己マーケティング支援**: エンジニアとしての存在感を高めるための戦略実行をサポート
- **トレンド分析**: 技術トレンドをモニタリングし、学習すべき技術や参加すべきプロジェクトを提案

## プロジェクト構成

git-resumeはモノレポ構造で、以下のアプリケーションとパッケージで構成されています：

### アプリケーション

- **[api](./apps/api/README.md)**: バックエンドAPI - GitHub連携、データ処理、レジュメ生成のサーバーサイド機能
- **[cli](./apps/cli/README.md)**: コマンドラインツール - ターミナルからGitHub連携やレジュメ生成を実行
- **[web](./apps/web/README.md)**: Webフロントエンド - ブラウザからの直感的なUI操作を提供

### 共有パッケージ

- **[models](./packages/models/README.md)**: データモデル - アプリケーション間で共有されるデータ構造
- **[services](./packages/services/README.md)**: 共通サービス - GitHub連携、Git操作、レジュメ生成などの共通機能
- **[utils](./packages/utils/README.md)**: ユーティリティ - 汎用的なヘルパー関数

### インフラストラクチャ

- **[infra](./infra/README.md)**: Terraformで記述されたインフラストラクチャ設定

## インストールと開発環境のセットアップ

### 前提条件

- Node.js v22.x以上
- pnpm v10.4.1以上
- Git

### 基本セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/ToyB0x/git-resume.git
cd git-resume

# 依存パッケージのインストール
pnpm install

# 環境変数の設定
cp .env.sample .env
# .envファイルを編集し、必要な環境変数を設定

# 開発サーバーの起動
pnpm dev
```

詳細なセットアップ手順は[開発者向けセットアップガイド](./docs/dev-guide/onboarding.md)を参照してください。

## 使用方法

### Webアプリケーション

```bash
# Webアプリの起動
pnpm dev --filter=web
```

ブラウザで http://localhost:5173 にアクセスし、GitHubアカウントを連携してください。

### コマンドラインツール

```bash
# CLIツールのグローバルインストール
npm install -g @resume/cli

# ユーザーのレジュメ生成
git-resume resume create --user <github-username>
```

### APIサーバー

```bash
# APIサーバーの起動
pnpm dev --filter=api

# APIエンドポイントの例
# GET http://localhost:3001/api/github/getUser?userName=<github-username>
```

## Clineでの開発

このリポジトリはCline拡張機能での開発をサポートしています。`.clinerules/`ディレクトリには、Clineがこのプロジェクトを効率的に理解し、一貫した開発を行うための各種ガイドラインが含まれています：

- [重要なドキュメント一覧](./.clinerules/important-docs.md) - プロジェクトの重要な資料の場所をまとめたリスト
- [コミットルール](./.clinerules/commit-rules.md) - コミットメッセージを作成する際のルール
- [repomixの活用](./.clinerules/repomix.md) - リポジトリコードを効率的に理解するための方法
- [ドキュメント更新](./.clinerules/prompts/update-docs.md) - ドキュメント更新時のルールとテンプレート

Clineを使用してコードを生成・変更する際は、これらのルールに従ってください。

---

© 2025 ToyB0x
