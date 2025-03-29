# Epic: UI Gap adjustment

## 目的

このエピックの目的は、現在の apps/web のコードと docs/epic/done/1.initial-architecture-and-design で記載された
- UI.md
- mocks
理想のUIとのギャップを埋めることです。エピックの成果物や完了条件は上記デザイン設計に従った、各URLパスの画面表示がブラウザからできることです。

## 概要

現在のapps/webのコードと理想のUIとの間には以下のようなギャップがあります：

1. **ルーティング構造の違い**
   - 現在: `/` と `/github/:userId` のみ
   - 理想: `/`, `/github/:username/plan`, `/github/:username/progress`, `/github/:username/results`, `/error`, `/help` など

2. **画面の分割**
   - 現在: 調査プロセスが1つの画面（`/github/:userId`）で完結
   - 理想: 調査プロセスが複数の画面（計画、進行、結果）に分かれている

3. **共通コンポーネントの実装**
   - 現在: ヘッダーとフッターが実装されていない
   - 理想: 共通のヘッダーとフッターが全画面に実装されている

4. **サービス名とブランディング**
   - 現在: サービス名が「GitHub Check」
   - 理想: サービス名が「Git Resume」

このエピックでは、これらのギャップを埋めるために、既存コードは可能な限り編集・削除せずに、新しいファイルや新しいURLパスとして追加実装します。また、画面表示する内容は、外部通信を行わないモックデータを作成・利用します。

## 関連ドキュメント

- [PROGRESS.md](./PROGRESS.md) - エピックの進捗状況
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 実装アーキテクチャと設計思想
- [UI.md](./UI.md) - UI実装の詳細とHTMLモック生成プロンプト
- [USER-GUIDE.md](./USER-GUIDE.md) - 追加機能のユーザーガイド

## 参照ドキュメント

- [理想のUI設計](../done/1.initial-architecture-and-design/UI.md) - 目標とするUI設計
- [モックアップ](../done/1.initial-architecture-and-design/mocks/) - 目標とするUIのHTMLモックアップ
