# ドキュメント検証システムの自己テスト

## 目的
- AIがドキュメントルールを正しく理解しているか検証する
- 検証結果を基に改善点を特定し、ドキュメント品質を向上させる
- LLMによるLLM評価アプローチを確立し、客観的な検証を実現する

## ファイル構成
```
docs/rules/self-check/
├── README.md                 # 本ドキュメント（検証システムの説明）
└── test/                     # テストケース用ディレクトリ
    ├── feature-spec/         # 機能仕様書の検証用ファイル
    │   ├── correct.md        # 正しい形式の機能仕様書
    │   └── wrong.md          # 間違った形式の機能仕様書
    └── api-doc/              # API仕様書の検証用ファイル
        ├── correct.md        # 正しい形式のAPI仕様書
        └── wrong.md          # 間違った形式のAPI仕様書
```

## ドキュメントルール理解度の検証手順

### 検証プロセスの概要
```
@docs/rules/self-check/README.md @docs/rules/self-check/test
test ディレクトリ配下の全てのwrong.mdファイルを分析し、各ドキュメントカテゴリのルール違反を検出してください。
(ファイルの変更は行わず、修正すべき点の検出のみを行ってください)

さらに検出結果をwrong.mdファイルと並置してあるcorrect.mdの内容と比較し、AIがドキュメントルールを正しく理解しているかを総合評価してください。

最後に総合評価結果を5段階の評価レベルで簡単に教えて下さい：
- レベル1: ほとんど役立っていない(50%未満)
- レベル2: ある程度役立っている(50%以上)
- レベル3: 効果的な精度で概ね検知できている(80%以上)
- レベル4: かなりの精度でほとんど検知できている(90%以上)
- レベル5: 完全に全て検知できている(100%)

さらに間違った内容について共通する問題パターンを特定し、課題と改善を提示してください。
```

## 検証用ファイル

本システムには、以下のテストケースファイルが用意されています：

- **機能仕様書（feature-spec）**
  - `test/feature-spec/wrong.md`: ドキュメントルールに違反した機能仕様書の例
  - `test/feature-spec/correct.md`: ドキュメントルールに準拠した機能仕様書の例

- **API仕様書（api-doc）**
  - `test/api-doc/wrong.md`: ドキュメントルールに違反したAPI仕様書の例
  - `test/api-doc/correct.md`: ドキュメントルールに準拠したAPI仕様書の例

これらのファイルは、AIがドキュメントルールを正しく理解し、問題点を検出できるかを検証するために使用します。各ファイルの内容は、それぞれのファイルを直接参照してください。

## 検証結果の活用方法
- 検出された問題点を基にドキュメントルールの明確化や詳細化を行う
- AIの理解度が低い領域については、より具体的な例やガイドラインを追加する
- 定期的に検証を実施し、AIの理解度の変化や改善点を追跡する
- 検証結果を基に、ドキュメント作成者向けのトレーニング資料を改善する

## 新しい検証用ファイルの追加方法
新しいドキュメントカテゴリの検証用ファイルを追加する場合は、以下の手順に従ってください：

1. `docs/rules/self-check/test/` 配下に新しいカテゴリ名のディレクトリを作成
2. そのディレクトリ内に `correct.md`（正解例）と `wrong.md`（間違い例）を作成
3. 各ファイルには、そのカテゴリのドキュメントルールに基づいた内容を記載
4. README.mdに新しいカテゴリの検証方法を追加

## AIインストラクション
このルールを読んだAIは以下の行動をとってください：
- 検証用ファイルを分析し、ドキュメントルールに照らして問題点を特定する
- 間違い例と正解例を比較し、自身の理解度を客観的に評価する
- 検証結果を明確なレポート形式で出力し、改善が必要な領域を特定する
- 必要に応じて新しいドキュメントカテゴリの検証用ファイルを生成する
- 定期的な自己評価を通じて、ドキュメントルール理解度の向上を図る

## メタデータ
**最終更新日**: 2025/03/23
**ステータス**: 作成中
**バージョン**: 0.1.0

## ドキュメント関係
### 参照ドキュメント
- [ドキュメントガイドライン](../../../README.md)
- [ドキュメント検証システム](../../validation.md)

### 被参照ドキュメント
- [ドキュメントルールの適用計画と進捗状況](../../../PLAN_AND_PROGRESS.md)

### 関連キーワード
#検証 #自己テスト #品質向上 #LLM評価

## Changelog
- 2025/3/23: [変更] 検証プロセスの概要を簡素化し、1つの統合された例に変更
- 2025/3/23: [追加] 5段階評価の判定と報告手順を追加
- 2025/3/23: 初回作成