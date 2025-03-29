# Epic ドキュメントテンプレート

## 基本構成

- docs/epic/[epicName]/
  - README.md // Epicの概要と背景・目的、各種関連ドキュメントのインデックス
  - PROGRESS.md // Epicの進捗をマークダウンのリストチェックボックス形式で簡単に記載したもの
  - ARCHITECTURE.md // Epicのアーキテクチャや設計思想を記載
  - USER-GUIDE.md // Epicで追加される機能のユーザガイド
  - UI.md // Epicで追加されるUIの詳細 (UIがない場合は省略)。ui モックを作成するための以下のセクションと内容を含む
    - セクション名: HTMLモック生成プロンプト例
    - 内容: HTMLモックを生成するためのプロンプト例を記載
      - 以下のプロンプト等でHTMLを生成することができます:
        ```html
        UI.md に合わせて画面案を html でページごとに mocks 出力して下さい
        その際に以下を遵守して下さい
        - Roo ModeはDesignerで実行して下さい
        - デザインテイストは既存の apps/web のウェブサイトアプリに合わせて下さい
        - Tailwind CSSを使用 (HTMLヘッダで読み込むのみで個別のCSSファイルは使わず単一HTMLで画面表示可能とする)
        ``` 
      - 生成したHTMLはHTMLディレクトリで `pnpm dlx http-server` を実行して閲覧できます


## 注意事項

- 上記基本構成のドキュメントは多くても100行~200行程度に収める
