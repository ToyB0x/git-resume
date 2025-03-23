# LLM向けIndex

## 目的

- LLMがプロジェクトのドキュメントを効率的に発見・理解し、必要な情報に迅速にアクセスできるようにする
- 人間とLLMの協働を最適化するための、ドキュメントに関するルールとベストプラクティスを集約する

## 重要ドキュメント一覧

このセクションは、プロジェクトの重要なドキュメントを、LLMが効率的に発見できるようにまとめたリストです。
LLMはプロジェクトを理解する際に、まずこのセクションを参照してください。

### プロジェクト全体

- [プロジェクト概要 (README.md)](../../README.md) - プロジェクトの目的、主要機能、全体像
- [ドキュメント基本方針 (docs/README.md)](../../docs/README.md) - ドキュメント体系の全体像、ガイドライン、ルール

### 開発関連

- [開発者ガイド (docs/guide/developer/README.md)](../../docs/guide/developer/README.md) - 開発環境構築、開発フロー、アーキテクチャ (今後作成予定)
- [アーキテクチャ決定記録 (docs/guide/developer/architecture/adr/)](../../docs/guide/developer/architecture/adr/) - アーキテクチャに関する重要な意思決定の記録 (今後作成予定)
- [パッケージ概要 (docs/guide/developer/packages/)](../../docs/guide/developer/packages/) - モノレポ内の各パッケージの概要と役割 (今後作成予定)

### 運用関連

- [運用者ガイド (docs/guide/operator/README.md)](../../docs/guide/operator/README.md) - デプロイメント、監視、メンテナンス (今後作成予定)

### ユーザー関連

- [ユーザーガイド (docs/guide/users/README.md)](../../docs/guide/users/README.md) - 基本操作、機能説明、トラブルシューティング (今後作成予定)

### 製品情報

- [製品ロードマップ (docs/product/roadmaps/README.md)](../../docs/product/roadmaps/README.md) - 製品の将来計画 (今後作成予定)
- [リリース済み機能 (docs/product/features/README.md)](../../docs/product/features/README.md) - 現在利用可能な機能 (今後作成予定)

## AI関連ドキュメント

このセクションは、AIが参照すべきルールやガイドラインへのリンクを提供します。

### 開発プロセス関連

- [コミットメッセージのルール](../../rules/ai/commit.md) - AIがコミットを提案する際のルール
- [AI設定ファイル確認](../../rules/ai/config-files.md) - AI設定ファイルの確認と最適化

### ツール活用関連

- [Repomix利用ルール](../../rules/ai/tools/repomix.md) - Repomixツールの効果的な活用方法
- [AI支援ツールの活用](../../rules/ai/tools/README.md) - AI支援ツール一覧

## AIインストラクション

このルールを読んだAIは以下の行動をとってください：

- LLM向けIndexの存在を確認し、重要ドキュメント一覧から全体像を把握する
- 重要ドキュメント一覧に記載されたドキュメントを優先的に参照し、プロジェクトの構造と内容を理解する
- 必要に応じてAI関連ドキュメントを参照し、プロジェクト固有のルールやガイドラインに従う
- ドキュメントの発見容易性を最優先に考慮し、必要な情報に迅速にアクセスできるようにする
- Indexの構造と内容を定期的に見直し、最新の情報を反映する(齟齬があれば報告・修正する)

## Changelog

- 2025/3/23: [変更] meta-directory.mdからindex.mdにリネームし、内容をIndex重視に更新
- 2025/3/23: 初回作成