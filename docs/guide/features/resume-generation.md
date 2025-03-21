# レジュメ生成機能ガイド

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

git-resume のレジュメ生成機能は、GitHubの活動データを分析し、エンジニアのスキルセットと経験を可視化した専門的なレジュメを自動的に作成します。このガイドでは、レジュメ生成の仕組み、カスタマイズ方法、活用方法について詳しく説明します。

## レジュメ生成の仕組み

### データソース

レジュメ生成に使用されるデータは、主に以下のソースから収集されます：

1. **GitHubプロフィール情報**
   - 基本プロフィール（名前、ユーザー名、ブログURLなど）
   - バイオグラフィーとプロフィール設定

2. **リポジトリデータ**
   - 所有リポジトリ
   - コントリビュートしたリポジトリ
   - スターを付けたリポジトリ

3. **コミット履歴**
   - コミットメッセージ
   - コミット頻度と分布
   - コードの変更内容

4. **プルリクエストとイシュー**
   - 作成したPRとイシュー
   - レビューしたPR
   - PR/イシューの内容と関連タグ

### 分析プロセス

収集されたデータは以下のプロセスで分析されます：

1. **データ収集**: GitHubのAPIを通じて最新データを取得
2. **言語・技術分析**: コード言語の使用率と専門性を評価
3. **プロジェクト分析**: 主要プロジェクトとその特徴を抽出
4. **時間傾向分析**: 活動の時系列変化からキャリアの進化を把握
5. **レジュメ構造化**: 分析結果をレジュメのセクションに構造化
6. **AI強化**: Gemini APIによるテキスト改善と最適化（オプション）

## レジュメの構成

生成されるレジュメは、以下のセクションで構成されています：

### 1. プロフィール概要

GitHubプロフィールから抽出した基本情報と、活動データから導き出した専門分野やキャリアハイライトを含むサマリーです。

例：
```
# 山田太郎（yamada-taro）

## プロフィール概要

フルスタック開発者として5年以上の経験を持ち、特にReactとNode.jsを用いたWebアプリケーション開発に強みがあります。
オープンソースコミュニティに積極的に貢献し、15以上のプロジェクトに参加。データ可視化やAPI設計のスペシャリストとして活動しています。
```

### 2. 技術スキル

使用言語やフレームワークをリポジトリでの使用頻度と専門性に基づいて評価します。

例：
```
## 技術スキル

### プログラミング言語
- JavaScript/TypeScript: 上級（主要リポジトリの65%で使用）
- Python: 中級（データ分析プロジェクトで主に使用）
- Go: 初級～中級（マイクロサービス開発で使用）

### フレームワーク・ライブラリ
- React: 上級（8つのプロジェクトで使用）
- Node.js/Express: 上級（バックエンド開発の主要技術）
- Docker: 中級（コンテナ化とデプロイメントで使用）

### その他のスキル
- GraphQL API設計
- CIパイプライン構築（GitHub Actions）
- クラウドサービス（AWS、GCP）
```

### 3. プロジェクト経験

貢献度が高いプロジェクトを抽出し、その内容と役割を詳細に記述します。

例：
```
## プロジェクト経験

### データ可視化ダッシュボード（data-viz-dashboard）
- **期間**: 2023年1月～現在
- **技術**: React, D3.js, TypeScript, AWS
- **役割**: メイン開発者・プロジェクトメンテナー
- **概要**: 複雑なデータセットをインタラクティブに可視化するWebダッシュボード。
- **成果**:
  - ユーザーによるカスタムチャート作成機能の実装
  - レンダリングパフォーマンスを60%改善
  - 5人のコントリビューターをコーディネート
```

### 4. 活動統計

GitHubでの活動パターンとコントリビューション状況を可視化します。

例：
```
## GitHub活動統計

- **総コミット数**: 1,247 （過去1年間）
- **プルリクエスト**: 87件作成、142件レビュー
- **コントリビューションカレンダー**: 週平均4.8日のアクティブ日
- **主要言語**: TypeScript (45%), JavaScript (30%), Python (15%)
```

### 5. 学習と成長

技術スタックの進化とスキル習得の軌跡を時系列で示します。

例：
```
## 学習と成長

### スキル習得タイムライン
- 2023年: Kubernetes、マイクロサービスアーキテクチャ
- 2022年: GraphQL、Serverless技術
- 2021年: React、TypeScript、モダンフロントエンド開発

### 注目の学習領域
現在はブロックチェーン技術とWeb3開発に焦点を当てて学習中。
```

## レジュメのカスタマイズ

### ウェブインターフェースでのカスタマイズ

Webアプリケーションでは、以下の方法でレジュメをカスタマイズできます：

1. **セクションの表示制御**
   - 各セクションの表示/非表示を切り替え
   - セクションの順序を変更
   
2. **内容の詳細度調整**
   - プロジェクト経験の詳細レベルを設定
   - 技術スキルの表示形式を選択（リスト、チャート、詳細説明）
   
3. **時間範囲フィルター**
   - 特定の期間のデータのみを含める
   - 最新の活動に重点を置く設定

4. **スタイルとテンプレート選択**
   - レジュメの全体的なスタイルを選択
   - カラースキームとフォントの調整

### CLIでのカスタマイズ

CLIツールを使用する場合、以下のオプションでカスタマイズできます：

```bash
# セクションの選択
git-resume resume create --user <username> --sections "profile,skills,projects"

# 出力形式の指定
git-resume resume create --user <username> --format markdown

# 時間範囲の設定
git-resume resume create --user <username> --start-date 2023-01-01 --end-date 2023-12-31

# テンプレートの指定
git-resume resume create --user <username> --template professional
```

### 手動編集

生成されたレジュメは以下の形式で出力され、手動で編集できます：

- **Markdown**: テキストエディタで直接編集
- **HTML**: ウェブブラウザで表示、CSSでスタイル調整
- **PDF**: 最終的な配布用フォーマット

## エクスポートと共有

### エクスポート形式

レジュメは以下の形式でエクスポートできます：

1. **Markdown**: 最も編集しやすい形式
2. **HTML**: ウェブサイトに埋め込み可能
3. **PDF**: 就職活動での提出に最適
4. **JSON**: プログラムによる処理用データ形式（API利用時）

### 共有オプション（開発中）

将来的に実装予定の共有機能：

- **公開URL生成**: レジュメを一意のURLで公開
- **直接共有**: メールや各種SNSへの直接共有
- **LinkedIn連携**: LinkedInプロフィールへの自動同期
- **ポートフォリオサイト連携**: 個人サイトへの埋め込み

## 高度な機能と活用方法

### AI強化レジュメ（Gemini API連携）

Gemini API連携を有効にすると、以下の機能が利用可能になります：

- プロジェクト説明の自然言語での拡充
- 技術スキルの市場価値評価
- キャリアストーリーの構築と強調
- 業界別・職種別のレジュメ最適化

設定方法：

```bash
# CLIでの設定
export RESUME_GEMINI_API_KEY=your_api_key
git-resume resume create --user <username> --ai-enhance

# Webアプリでの設定
設定ページでAPIキーを入力し、「AI強化」オプションを有効化
```

### カスタムデータの統合

外部データを組み合わせたレジュメ作成（開発中）：

- 特定のプロジェクトの詳細説明ファイルの取り込み
- LinkedIn、Qiitaなどの他のプラットフォームのデータ統合
- 社内プロジェクト情報の取り込み（プライベートモード）

### 目的別レジュメ生成

特定の目的に最適化されたレジュメを生成：

- 職種別テンプレート（フロントエンド、バックエンド、DevOpsなど）
- 業界別最適化（金融、ヘルスケア、エンターテイメントなど）
- 採用形態別（正社員、フリーランス、アカデミックなど）

## ベストプラクティスとTips

### 効果的なレジュメのために

1. **GitHubプロフィールの充実**
   - ユーザープロフィールの完全な記入
   - リポジトリの説明とREADMEの充実
   - 意味のあるコミットメッセージの使用

2. **プロジェクトの表現力向上**
   - リポジトリのトピックタグを適切に設定
   - プロジェクトの説明文を詳細に記述
   - 主要機能や技術スタックを明記

3. **カスタマイズのポイント**
   - 応募職種に関連するプロジェクトを強調
   - 求人要件に合わせた技術スキルの並び順調整
   - 職務経歴との整合性確保

4. **更新頻度**
   - 定期的なレジュメ再生成で最新の活動を反映
   - キャリア目標の変化に合わせたテンプレート変更
   - 四半期ごとのレビューと更新を推奨

## トラブルシューティング

レジュメ生成時の一般的な問題と解決方法については、[トラブルシューティングガイド](/docs/guide/troubleshooting.md)の「レジュメ生成の問題」セクションを参照してください。

## 今後の開発予定

レジュメ生成機能の今後の拡張計画：

- **マルチプラットフォーム統合**: GitLabやBitbucketなど他のプラットフォームからのデータ統合
- **インタラクティブレジュメ**: インタラクティブな要素を含むHTML5レジュメ
- **AI面接準備**: レジュメ内容に基づく想定面接質問の生成と回答例
- **チーム/組織レジュメ**: チームや組織全体のスキルマトリックスとレジュメ

## Changelog

- 2025/3/21: 初回作成
