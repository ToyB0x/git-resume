# ユーザーダッシュボード機能 技術設計書

**更新日**: 2025/03/01
**確認日**: 2025/03/01
**作成者**: 開発チーム
**レビュアー**: テックリード
**関連PRD**: [PRD-123: ユーザーダッシュボード機能](../../../prd-link-placeholder)

## 目的

このドキュメントは、git-resumeプロジェクトにおけるユーザーダッシュボード機能の技術的な設計と実装計画を詳細に記述したものです。ダッシュボード機能はユーザーのGitHub活動を視覚的に表示し、キャリア成長の追跡を可能にする中核機能です。

## ドキュメント構成

このTDDは複数のファイルに分割されています。以下の構成で技術設計の詳細を確認できます：

### 全体設計

- [アーキテクチャ設計](./architecture.md) - システム全体のアーキテクチャと設計原則
- [データフロー](./data-flow.md) - コンポーネント間のデータの流れと処理
- [E2Eテスト計画](./e2e-tests.md) - エンドツーエンドテストの方針と計画

### パッケージ別設計

- API
  - [API概要](./packages/api/README.md) - APIエンドポイントの変更概要
  - [API実装詳細](./packages/api/implements.md) - 具体的な実装方法と例
  - [APIテスト](./packages/api/tests.md) - APIのテスト計画

- サービス
  - [サービス層概要](./packages/services/README.md) - サービス層の変更概要
  - [データ集約ロジック](./packages/services/implements.md) - スキル分析と集約の具体的な実装方法

### フロントエンド設計

- [フロントエンド概要](./frontend/README.md) - フロントエンド変更の全体像
- [UIコンポーネント](./frontend/ui-components.md) - 共通UIコンポーネントの設計
- 画面設計
  - [ダッシュボード画面](./frontend/screens/dashboard-screen.md) - メインダッシュボード画面の設計

## 主要な技術的決定

1. **リアルタイムデータ更新**：WebSocketを使用してダッシュボードデータをリアルタイムで更新
2. **データキャッシング戦略**：Redisを使用したAPIレスポンスのキャッシングによる高速化
3. **グラフ描画ライブラリ**：D3.jsではなくChartjsを採用（軽量さと導入の容易さを優先）
4. **レスポンシブデザイン**：モバイルファーストのアプローチによるマルチデバイス対応

## 設計の参考資料

- [Chartjs公式ドキュメント](https://www.chartjs.org/docs/latest/)
- [Redisキャッシング戦略](https://redis.com/blog/redis-as-an-api-rate-limiting-solution/)
- [WebSocketベストプラクティス](https://websockets.readthedocs.io/en/stable/intro.html)

## Changelog

- 2025/03/01: 初回作成
