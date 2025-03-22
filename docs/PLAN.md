# ドキュメントルールの適用計画

**更新日**: 2025/3/23
**確認日**: 2025/3/23

## 目的

- 現在のドキュメント構造から新しいドキュメント構造への移行計画を策定する
- 段階的な移行を実現し、混乱を最小限に抑える
- 優先順位に基づいた効率的な改善を実現する
- 移行プロセスを透明化し、全ステークホルダーに共有する

## 現状分析

### 現在のディレクトリ構造

現在のドキュメント構造は以下のようになっています：

```
docs/
├── README.md                         # ドキュメンテーションシステムのガイドライン
├── PROGRESS.md                       # ドキュメントルールの適用状況
├── guide/                            # ユーザー向けガイド
│   ├── README.md                     # ユーザーガイド全体の目次
│   ├── features/                     # 機能詳細説明
│   │   └── resume-generation.md      # レジュメ生成機能の説明
│   ├── usage/                        # 使用方法
│   │   ├── api-guide.md              # API使用ガイド
│   │   ├── cli-guide.md              # CLI使用ガイド
│   │   └── web-guide.md              # Web使用ガイド
│   ├── troubleshooting.md            # トラブルシューティング
│   └── releases/                     # リリース情報
│       ├── README.md                 # リリースガイド概要
│       └── CHANGELOG.md              # バージョン履歴
├── dev-guide/                        # 開発者向けガイド
│   ├── README.md                     # 開発ガイド全体の目次
│   ├── project-overview.md           # プロジェクト概要
│   ├── onboarding.md                 # 開発環境構築等
│   ├── development-flow.md           # 開発フロー関連
│   ├── roadmap.md                    # 開発ロードマップ
│   ├── architecture/                 # アーキテクチャ関連
│   │   ├── README.md                 # アーキテクチャガイド概要
│   │   ├── overview.md               # システム全体設計
│   │   ├── data-models.md            # データモデル説明
│   │   └── adr/                      # アーキテクチャ決定記録
│   │       ├── README.md             # ADR目次
│   │       └── 001-spa-mode/         # 個別ADR
│   └── templates/                    # 開発ドキュメントテンプレート
│       ├── README.md                 # テンプレート全体の説明と使い方
│       ├── prd-template.md           # PRDテンプレート
│       ├── tech-template.md          # TDDテンプレート
│       └── example-feature/          # 機能開発ドキュメントの包括的な参考例
└── rules/                            # ドキュメントルール
    ├── README.md                     # ドキュメントルール一覧と概要
    ├── format/                       # フォーマットに関するルール
    │   ├── README.md                 # フォーマットルールの概要
    │   └── links.md                  # リンク方法に関するルール
    ├── structure.md                  # 配置構造に関するルール
    ├── types.md                      # 種別定義に関するルール
    └── validation.md                 # ドキュメント検証システム
```

### 目標とするディレクトリ構造

Guidelineに基づく理想的なディレクトリ構造は以下の通りです：

```
docs/
├── README.md                         # ドキュメントガイドライン
├── PLAN.md                           # ドキュメントルールの適用計画（本ドキュメント）
├── PROGRESS.md                       # ドキュメントルールの適用状況
├── guide/                            # すべてのガイドのIndex
│   ├── README.md                     # ガイド全体の目次と導入
│   ├── developer/                    # 開発者向けガイド
│   │   ├── README.md                 # 開発者向けガイド目次
│   │   ├── getting-started/          # 開発環境構築等
│   │   ├── development-flow/         # 開発フロー関連
│   │   ├── packages/                 # モノレポ内のパッケージ概要
│   │   ├── architecture/             # アーキテクチャ関連
│   │   │   ├── adr/                  # アーキテクチャ決定記録
│   │   │   └── ...
│   │   └── ...
│   ├── operator/                     # 運用者向けガイド
│   │   ├── README.md
│   │   ├── deployment/               # デプロイメント関連
│   │   ├── monitoring/               # 監視関連
│   │   ├── maintenance/              # メンテナンス関連
│   │   └── ...
│   └── users/                        # ユーザー向けガイド
│       ├── README.md                 # ユーザー向けガイド目次
│       ├── basics/                   # 基本操作ガイド
│       ├── integration/              # 連携関連ガイド
│       └── ...
├── templates/                        # すべてのテンプレートを集約
│   ├── README.md                     # テンプレート全体の説明と使い方
│   ├── documents/                    # ドキュメント作成用テンプレート
│   ├── development/                  # 開発用テンプレート
│   └── operations/                   # 運用用テンプレート
├── rules/                            # ドキュメントルール
│   ├── README.md                     # ドキュメントルール一覧と概要
│   ├── ai/                           # AI関連ドキュメントルール
│   │   ├── README.md                 # AI関連ルールの概要
│   │   ├── config/                   # AIの設定ファイル確認
│   │   ├── minimum-change/           # 最小変更ルール
│   │   ├── ask/                      # 質問ルール
│   │   ├── commit/                   # コミットメッセージルール
│   │   ├── tools/                    # ツール活用ルール
│   │   ├── maintenance/              # ドキュメント更新ルール
│   │   └── preparation/              # AI利用準備ルール
│   ├── guide/
│   │   ├── developer/                # 開発者向けドキュメントルール
│   │   │   ├── code/                 # コードファイルルール
│   │   │   ├── package/              # パッケージREADMEルール
│   │   │   ├── architecture/         # アーキテクチャルール
│   │   │   └── development-flow/     # 開発フローのルール
│   │   ├── operator/                 # 運用者向けルール
│   │   └── users/                    # ユーザー向けルール
│   ├── documents/                    # ドキュメント全般ルール
│   │   ├── README.md                 # 概要
│   │   ├── maintenance/              # 更新ルール
│   │   └── metadata/                 # メタデータルール
│   │       ├── changelog/            # Changelogルール
│   │       ├── maintenance-date/     # メンテナンス日付ルール
│   │       ├── relations/            # 参照関係ルール
│   │       └── ...
│   └── product/                      # プロダクト関連ルール
└── product/                          # プロダクト情報
    ├── README.md                     # プロダクト概要
    ├── vision.md                     # ビジョン・ミッション
    ├── product-goal.md               # 製品目標
    ├── value-proposition.md          # 価値提案
    ├── members.md                    # 開発メンバー
    ├── features/                     # リリース済み機能
    │   ├── README.md                 # 機能一覧と概要
    │   └── [機能名]/                 # 個別機能ディレクトリ
    │       ├── overview.md           # 機能概要（ユーザー向け）
    │       ├── technical-details.md  # 技術詳細（開発者向け）
    │       └── specs.md              # 仕様
    └── roadmaps/                     # 未来の機能計画
        ├── README.md                 # ロードマップ概要
        └── [予定機能名]/             # 予定機能の詳細計画
```

## 移行計画

### フェーズ1: 基盤整備（2025/3/23 - 2025/3/31）

- [x] ドキュメントガイドラインの策定（`docs/README.md`）
- [x] ドキュメント種別の定義（`docs/rules/types.md`）
- [x] ドキュメントの配置構造の定義（`docs/rules/structure.md`）
- [x] ドキュメントフォーマットの定義（`docs/rules/format/README.md`）
- [x] ドキュメント内のリンク方法（`docs/rules/format/links.md`）
- [x] ドキュメント検証システムの概念設計（`docs/rules/validation.md`）
- [x] ドキュメントルールの適用計画（`docs/PLAN.md`）
- [x] ドキュメントルールの適用状況（`docs/PROGRESS.md`）
- [ ] ルールディレクトリの再構成
  - [ ] `docs/rules/ai/` ディレクトリの作成
  - [ ] `docs/rules/guide/` ディレクトリの作成
  - [ ] `docs/rules/documents/` ディレクトリの作成
  - [ ] `docs/rules/product/` ディレクトリの作成

### フェーズ2: ディレクトリ構造の再編成（2025/4/1 - 2025/4/15）

- [ ] ガイドディレクトリの再構成
  - [ ] `docs/guide/developer/` ディレクトリの作成
  - [ ] `docs/guide/operator/` ディレクトリの作成
  - [ ] `docs/guide/users/` ディレクトリの作成
  - [ ] 現在の `docs/dev-guide/` から `docs/guide/developer/` への移行
  - [ ] 現在の `docs/guide/` から `docs/guide/users/` への移行
- [ ] テンプレートディレクトリの作成
  - [ ] `docs/templates/` ディレクトリの作成
  - [ ] 現在の `docs/dev-guide/templates/` から `docs/templates/` への移行
- [ ] プロダクト情報ディレクトリの作成
  - [ ] `docs/product/` ディレクトリの作成
  - [ ] プロダクト概要、ビジョン、ロードマップなどの作成

### フェーズ3: ルールの拡充（2025/4/16 - 2025/4/30）

- [ ] AI関連ルールの作成
  - [ ] コミットメッセージルール（`docs/rules/ai/commit/README.md`）
  - [ ] 設定ファイルルール（`docs/rules/ai/config/README.md`）
  - [ ] ツール活用ルール（`docs/rules/ai/tools/README.md`）
- [ ] ドキュメント全般ルールの作成
  - [ ] メタデータルール（`docs/rules/documents/metadata/README.md`）
  - [ ] 依存関係管理ルール（`docs/rules/documents/relations/README.md`）
  - [ ] ナビゲーション構造ルール（`docs/rules/documents/navigation/README.md`）

### フェーズ4: コンテンツの充実（2025/5/1 - 2025/5/31）

- [ ] 開発者ガイドの充実
  - [ ] パッケージ概要の作成（`docs/guide/developer/packages/`）
  - [ ] アーキテクチャドキュメントの拡充
- [ ] 運用者ガイドの作成
  - [ ] デプロイメントガイド（`docs/guide/operator/deployment/`）
  - [ ] 監視ガイド（`docs/guide/operator/monitoring/`）
- [ ] ユーザーガイドの充実
  - [ ] 基本操作ガイド（`docs/guide/users/basics/`）
  - [ ] 統合ガイド（`docs/guide/users/integration/`）

### フェーズ5: 検証システムの実装（2025/6/1 - 2025/6/30）

- [ ] AIプロンプト設計
  - [ ] 検証コマンドとプロンプトのマッピング定義
  - [ ] 各検証項目に対するプロンプトテンプレート作成
- [ ] 検証プロセスの確立
  - [ ] 定期的な検証の仕組み
  - [ ] 問題報告と修正のワークフロー

## 移行の優先順位付け基準

1. **影響範囲**: より多くのステークホルダーに影響するドキュメントを優先
2. **更新頻度**: 頻繁に参照・更新されるドキュメントを優先
3. **技術的依存**: 他のドキュメントから多く参照されるドキュメントを優先
4. **実装容易性**: 短期間で大きな改善が見込める項目を初期に実施

## 移行時の注意点

1. **リンク切れの防止**
   - 移行前に全ての内部リンクをリスト化
   - 移行後に全てのリンクを検証
   - 必要に応じてリダイレクトファイルを作成

2. **段階的な移行**
   - 一度にすべてを移行するのではなく、段階的に実施
   - 各フェーズ完了後に検証を行い、問題があれば修正

3. **並行運用期間の設定**
   - 移行中は旧構造と新構造を並行運用
   - 十分な移行期間を設け、ユーザーに周知

4. **メタデータの更新**
   - 移行時に全てのドキュメントのメタデータを更新
   - 特に更新日、確認日、Changelogを正確に記録

## 移行の成功指標

1. **リンク有効性**: 移行後のリンク切れの数（目標: 0）
2. **構造準拠率**: 新しい構造に準拠したドキュメントの割合（目標: 100%）
3. **メタデータ完全性**: 正確なメタデータを持つドキュメントの割合（目標: 100%）
4. **ユーザーフィードバック**: 移行後のドキュメント使用性に関するフィードバック

## AIインストラクション

このドキュメントを読んだAIは以下の行動をとってください：

- 移行計画に従って、ドキュメントの再構成と移行を支援する
- 各フェーズの進捗状況を把握し、次のステップを提案する
- リンク切れや構造の不整合を検出し、修正を提案する
- 移行中のユーザー混乱を最小限に抑えるための戦略を提案する

## Changelog

- 2025/3/23: 初回作成