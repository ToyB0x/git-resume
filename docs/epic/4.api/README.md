# Epic: APIサーバー実装

## 目的

このエピックの目的は、**Deep ResearchシステムのバックエンドAPIサーバーを実装すること**です。このAPIサーバーは、GitHub User名を入力した後の1次分析（基本情報取得段階）と2次分析（詳細Git活動分析段階）の進捗管理・結果取得を行うためのインターフェースを提供します。

## 概要

このエピックでは、初期アーキテクチャ設計で定義されたAPIエンドポイントを実装します。`packages/database/src/job.ts`のスキーマとSTATUSタイプを活用して、効率的なAPIエンドポイントを設計しました。具体的には、以下のAPIエンドポイントを実装します：

1. **1次分析(プロフィール取得)兼診断状況(結果含む)読込API**: GitHub User名に対する現在の2次分析状態、進捗、結果、および1次分析のプロフィール情報を一括取得するAPI
2. **2次分析実行API**: 詳細Git活動分析ジョブを起動するAPI

これらのAPIは、CloudFlare Workersを使用してエッジで高速に実行され、フロントエンドとバックグラウンド処理（Cloud Run Jobs）の橋渡しを行います。また、このエピックではCloudFlare Workersのデプロイも含めます。

## 技術スタック

- **実行環境**: CloudFlare Workers（エッジでの高速実行、グローバル分散）
- **フレームワーク**: Hono.js（軽量、高速、TypeScriptサポート）
- **API設計**: RESTful API（標準的、理解しやすい、キャッシュ可能）
- **外部API連携**:
  - GitHub API（プロフィール情報取得）
  - Cloud Run Jobs API（2次分析ジョブの起動）
- **データベース連携**: Neon.tech（PostgreSQL互換、サーバーレス）
- **デプロイ**: Wrangler CLI（CloudFlare Workersのデプロイツール）

## 関連ドキュメント

以下のドキュメントは、APIサーバー実装の詳細を記載しています：

- [進捗状況](./PROGRESS.md) - 実装の進捗状況
- [アーキテクチャ設計](./ARCHITECTURE.md) - APIサーバーのアーキテクチャと設計思想の詳細
- [実装ガイド](./implements/README.md) - APIサーバーの実装に必要なファイルとその内容
- [Cloud Run Jobs連携](./implements/jobs-client.md) - CloudFlare WorkersからCloud Run Jobsを実行する方法
- [デプロイガイド](./implements/deploy-guide.md) - CloudFlare Workersのデプロイ手順

注: このエピックではAPIサーバーの実装のみを行い、UIの実装は含まれません。APIの動作確認はcURLコマンドを使用して行います。

## 参考資料

- [初期アーキテクチャ設計](../done/1.initial-architecture-and-design/ARCHITECTURE.md) - システム全体のアーキテクチャと設計思想
- [GitHub分析ジョブ実装](../3.job/ARCHITECTURE.md) - 2次分析処理の実装詳細