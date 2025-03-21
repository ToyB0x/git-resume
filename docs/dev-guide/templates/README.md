# 開発ドキュメントテンプレート

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

このディレクトリには、git-resumeプロジェクトの開発プロセスで使用するドキュメントテンプレートが格納されています。これらのテンプレートを使用することで、一貫性のある高品質なドキュメントを効率的に作成できます。

## 利用可能なテンプレート

### 基本テンプレート

- [PRDテンプレート](./prd-template.md) - 製品要件定義書（Product Requirement Document）のテンプレート
- [技術設計書テンプレート](./tech-template.md) - 技術設計書（Technical Design Document）のテンプレート

### 包括的な機能開発ドキュメントの例

`example-feature` ディレクトリには、機能開発の全プロセスをカバーする包括的なドキュメントの例が含まれています：

- [機能概要](./example-feature/README.md) - 機能の全体像と各ドキュメントへの参照
- [要件定義](./example-feature/PRD/) - PRDの実装例
- [技術設計](./example-feature/Technical-Design/) - 技術設計書の実装例
  - [アーキテクチャ](./example-feature/Technical-Design/architecture.md)
  - [フロントエンド実装](./example-feature/Technical-Design/frontend/)
  - [APIバックエンド実装](./example-feature/Technical-Design/packages/api/)
- [リリース計画](./example-feature/Release/) - リリース関連のドキュメント例

## テンプレートの使い方

### 新機能のドキュメント作成

1. 適切なテンプレートをコピーして新しいファイルを作成
2. プレースホルダー（`[機能名]`など）を実際の情報に置き換え
3. 各セクションを機能の詳細に応じて編集
4. 必要に応じて図表やコード例を追加
5. レビュー前にドキュメントの一貫性と完全性を確認

### テンプレートのカスタマイズ

プロジェクトの特性や要件に合わせてテンプレートをカスタマイズする場合は、以下の点に注意してください：

- 既存のセクション構造を尊重し、一貫性を維持する
- 追加したセクションの目的と期待される内容を明確に説明する
- 変更履歴を記録し、テンプレートの進化を追跡する
- 変更をチームと共有し、フィードバックを収集する

## ドキュメント作成のベストプラクティス

1. **明確さと簡潔さ**：複雑な概念も明確かつ簡潔に説明する
2. **実用的な詳細レベル**：重要な詳細を提供しつつ、不必要な情報は避ける
3. **視覚的な説明**：必要に応じて図表やダイアグラムを使用して概念を視覚化する
4. **一貫した用語**：プロジェクト全体で一貫した用語と定義を使用する
5. **更新履歴の管理**：ドキュメントの変更履歴を適切に記録する

## ドキュメント間の関連性

機能開発の各フェーズで作成するドキュメントは、相互に関連しており、一貫性を保つ必要があります：

- PRDで定義された要件は、技術設計書で対応する実装方法が示されるべき
- 技術設計書の内容は、実際の実装とコードレビューの基準となる
- リリース計画とリリースノートは、PRDの要件と技術設計書の範囲を反映すべき

詳細な開発フローとドキュメント作成のタイミングについては、[開発フロー](/docs/dev-guide/development-flow.md)を参照してください。

## 関連資料

- [開発フロー](/docs/dev-guide/development-flow.md)
- [ドキュメンテーションガイド](/docs/README.md)

## Changelog

- 2025/3/21: 初回作成（docs/templates/ から移動・再構成）
