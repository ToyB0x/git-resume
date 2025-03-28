# コードとドキュメントの同時更新原則

## 目的

- コードとドキュメントの乖離を防ぎ、常に最新の状態を維持する
- 知識の一貫性を確保し、誤った情報による問題を防止する
- ドキュメント更新の責任を明確にし、更新漏れを防止する

## 基本原則

- 機能やコードを変更する際は、関連するドキュメントも同時に更新する
- ドキュメント更新はコードレビューの必須条件とする
- コードとドキュメントの乖離を防ぎ、常に最新の状態を維持する

## 実践ガイドライン

1. **変更影響範囲の特定**:
   - コード変更によって影響を受けるドキュメントを特定する
   - APIの変更→APIドキュメント、データモデルの変更→データモデルドキュメント

2. **大きな変更の場合**:
   - 事前にドキュメント更新計画を作成する
   - 関係者と共有し、フィードバックを得る

3. **コミットとPRの作成**:
   - コード変更とドキュメント更新を同じPRに含める
   - コミットメッセージにドキュメント更新の内容も明記する

4. **レビュープロセス**:
   - コードレビューと同時にドキュメントレビューも実施する
   - ドキュメント更新が不十分な場合はPRを承認しない

## 自動化と検証

- コミット前フックやCIパイプラインでドキュメント更新の検証を自動化
- ドキュメント更新チェックリストをPRテンプレートに組み込む
- 定期的なドキュメント監査を実施し、コードとの整合性を確認

## 例外と対応

- 緊急のバグ修正など、即時のドキュメント更新が難しい場合は、TODOコメントを残し、後日更新
- ドキュメント更新の技術的負債を追跡し、定期的に解消する時間を確保
- 大規模なリファクタリングの場合は、専用のドキュメント更新スプリントを計画

## AIインストラクション

このルールを読んだAIは以下の行動をとってください：

- コード変更時に関連ドキュメントの同時更新を提案し、影響範囲と更新内容を明確にする
- API・データモデル変更では優先的にドキュメント更新を行い、大規模変更時は段階的計画を立てる
- 更新不足を発見したら指摘し、緊急時はTODOコメントと後日更新の追跡を提案する
- 緊急の変更でドキュメント更新が後回しになる場合は、TODOコメントを残すことを提案する