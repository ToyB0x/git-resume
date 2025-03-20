# Web Application

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

git-resumeプロジェクトのWebフロントエンドアプリケーションです。GitHub活動の可視化、レジュメ生成、キャリアプランニング支援などの機能をブラウザから利用できるインターフェースを提供します。

## 主要機能

### GitHubユーザー情報の表示

```
/github/:userId
```

GitHubユーザーのプロフィール情報、リポジトリ一覧、活動履歴などを表示します。レジュメの元となる情報を確認できます。

### ホームダッシュボード

```
/home
```

ユーザーのダッシュボード画面です。活動サマリー、スキル分析、キャリア推奨事項などを表示します。

### ウェルカム画面

サイトの概要や使い方を説明するウェルカム画面です。初回訪問時やログアウト状態で表示されます。

## 技術スタック

- **言語**: TypeScript
- **フレームワーク**: React
- **ルーティング**: React Router
- **API連携**: Hono.js クライアント
- **パッケージ管理**: pnpm
- **ビルドツール**: Vite
- **デプロイメント**: Cloudflare Pages/Workers

## 開発方法

### 必要条件

- Node.js v22.x
- pnpm v10.4.1以上

### ローカル開発

1. 依存パッケージのインストール:
   ```
   pnpm install
   ```

2. 開発サーバーの起動:
   ```
   pnpm dev --filter=web
   ```
   WebアプリはデフォルトでViteの標準ポート(http://localhost:5173)で起動します。

3. ビルド:
   ```
   pnpm build --filter=web
   ```
   ビルド成果物は`dist`ディレクトリに生成されます。

4. プレビュー:
   ```
   pnpm preview --filter=web
   ```
   ビルド済みのアプリをローカルでプレビューできます。

### 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `VITE_API_URL` | バックエンドAPIのURL | `http://localhost:3001` |
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | - |

## デプロイメント

このアプリケーションはCloudflare Pages/Workersへのデプロイを想定しています。

```bash
# Wranglerを使用したデプロイ
pnpm wrangler pages deploy dist
```

## ディレクトリ構造

```
web/
├── app/                  # アプリケーションコード
│   ├── clients/          # APIクライアント
│   ├── routes/           # ページコンポーネント
│   ├── welcome/          # ウェルカム画面のアセット
│   ├── app.css           # グローバルスタイル
│   ├── root.tsx          # ルートコンポーネント
│   └── routes.ts         # ルート定義
├── public/               # 静的アセット
├── Dockerfile            # Dockerファイル
├── package.json          # パッケージ設定
├── vite.config.ts        # Vite設定
└── wrangler.jsonc        # Cloudflare Workersの設定
```

## 関連ドキュメント

- [プロジェクト概要](/docs/guide/project-overview.md)
- [APIアプリケーション](/apps/api/README.md)
- [SPAモード設計](/docs/ADR/001-spa-mode/README.md)

## Changelog

- 2025/3/21: 初回作成
