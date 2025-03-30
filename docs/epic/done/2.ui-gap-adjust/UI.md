# UI Gap adjustment UI設計

## UI実装方針

このエピックでは、docs/epic/done/1.initial-architecture-and-design/UI.mdで定義された理想のUIに合わせて、現在のapps/webのコードを拡張します。以下の方針に基づいて実装を行います：

1. **デザインの一貫性**
   - ダークテーマベースのグラデーションリッチなデザイン
   - グラスモーフィズム効果の適用
   - Interフォントの使用
   - 定義されたカラーパレットとタイポグラフィの適用

2. **レスポンシブデザイン**
   - モバイル（320px - 767px）
   - タブレット（768px - 1023px）
   - デスクトップ（1024px以上）

3. **アクセシビリティ**
   - キーボードナビゲーション
   - ダークモード最適化
   - ブラウザで表示するテキストは全て英語で統一

## 実装対象画面

### 1. ホーム画面（調整）

**URL**: `/`

**主要コンポーネント:**
- 中央のパネルコンポーネント（Card）
  - サービスのロゴ（「Git Resume」に変更）
  - サービスの1行コンセプト
  - GitHub User名入力フォーム（GithubIconを含む）
  - 調査開始ボタン（btn-gradient）
  - 水平区切り線（HR）
  - "Proceed to research planning" のテキスト

**変更点:**
- サービス名を「GitHub Check」から「Git Resume」に変更
- 「Proceed to research planning」テキストの追加
- フッターの追加

### 2. 調査計画画面（新規）

**URL**: `/github/:username/plan`

**主要コンポーネント:**
- 基本情報セクション: GitHub User名と基本プロフィール（UserInfoCard）
- 調査計画概要: 実行予定の調査ステップのリスト（StepCard）
- 予想時間表示: 全体の予想所要時間
- アクションボタン: 「Execute Research」

### 3. 調査進行画面（新規）

**URL**: `/github/:username/progress`

**主要コンポーネント:**
- 進捗バー: 全体の進行状況を視覚的に表示
- ステップリスト: 各調査ステップの状態（待機中/進行中/完了/エラー）
- 離脱安全インジケーター: ユーザーがいつでも安全に離脱できることを示す
- アクションボタン: 「Cancel Research」

### 4. 調査結果画面（新規）

**URL**: `/github/:username/results`

**主要コンポーネント:**
- 基本情報: GitHub User名、プロフィール画像、基本プロフィール情報
- レジュメ本文: AI生成のレジュメ（Markdown形式で表示）
- アクションボタン: 「Export」と「Share」（ShareButton）

### 5. エラー画面（新規）

**URL**: `/error`

**主要コンポーネント:**
- エラー情報の表示
- トラブルシューティングのガイダンス
- ホームに戻るボタンと再試行ボタン

### 6. ヘルプ・サポート画面（新規）

**URL**: `/help`

**主要コンポーネント:**
- ヘルプドキュメント
- よくある質問（FAQ）
- サポート連絡先

### 7. 履歴画面（新規）

**URL**: `/history`

**主要コンポーネント:**
- 過去に調査したGitHubユーザーのリスト
- 各ユーザーの基本情報と調査日時
- 結果を再表示するためのリンク

### 8. 共通コンポーネント

**フッター**:

全体を上限2段に分けて、以下の要素を含む:

- ナビゲーションメニュー (中央寄せでレスポンシブ対応し、横幅に収まりきらない項目は縦に折り返す)
  - Home
  - History
  - 利用規約へのリンク
  - プライバシーポリシーへのリンク
  - Helpへのリンク
- 著作権表示

**ローディング表示**:
- スケルトンローダー
- スピナー
- プログレスバー

**カードコンポーネント**:
- ガラスモーフィズム風のカードコンポーネント
- 調整可能なパディング、マージン、テキスト配置、最大幅、幅

## HTMLモック生成プロンプト例

以下のプロンプト等でHTMLを生成することができます:
```html
UI.md に合わせて画面案を html でページごとに mocks 出力して下さい
その際に以下を遵守して下さい
- Roo ModeはDesignerで実行して下さい
- デザインテイストは既存の apps/web のウェブサイトアプリに合わせて下さい
- ダークテーマベースのグラデーションリッチなデザイン
- Tailwind CSSを使用 (HTMLヘッダで読み込むのみで個別のCSSファイルは使わず単一HTMLで画面表示可能とする)
- Interフォントを使用
- グラスモーフィズム効果を適用
```

生成したHTMLはHTMLディレクトリで `pnpm dlx http-server` を実行して閲覧できます

## カラーパレット

- **ベースカラー**:
  - ダークテーマ: #0F172A (bg-gray-950)
  - グラデーション背景: #0F172A → #172554 → #581C87 (from-gray-950 via-blue-950 to-purple-950)

- **アクセントカラー**:
  - プライマリグラデーション: #22D3EE → #3B82F6 → #9333EA (from-cyan-400 via-blue-500 to-purple-600)
  - セカンダリグラデーション: #6366F1 → #8B5CF6 → #D946EF (from-indigo-500 via-purple-500 to-pink-500)

- **UI要素**:
  - カード背景: rgba(0, 0, 0, 0.6) (bg-black/60)
  - ボーダー: #1F2937 (border-gray-800)
  - テキスト: #FFFFFF, #D1D5DB (text-white, text-gray-300)
  - セカンダリテキスト: #9CA3AF (text-gray-400)

## タイポグラフィ

- **フォントファミリー**: "Inter", ui-sans-serif, system-ui, sans-serif
- **見出し**:
  - H1: 2.25rem (text-4xl), font-bold/font-extrabold
  - H2: 1.875rem (text-3xl), font-bold
  - H3: 1.5rem (text-2xl), font-semibold
- **本文**: 1rem (text-base), font-normal
- **小テキスト**: 0.875rem (text-sm), font-normal
- **ボタンテキスト**: 1rem (text-base), font-medium

## CSS実装

app.cssでは以下のようなスタイルが定義されています：

```css
/* Background gradient */
.bg-gradient-dark {
  @apply bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950;
}

/* Text gradient */
.text-gradient {
  @apply bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent;
}

/* Button gradient */
.btn-gradient {
  @apply bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700 text-white font-medium rounded-lg py-3 px-4;
}

/* HR gradient */
.hr-gradient {
  @apply bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-700;
}

/* Glass morphism */
.glass {
  @apply bg-black/60 backdrop-blur-sm;
}

/* Progress gradient */
.progress-gradient {
  @apply bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600;
}
```

これらのスタイルは、UIコンポーネント全体で一貫して使用されています。