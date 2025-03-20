# API Application

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

git-resumeプロジェクトのバックエンドAPIアプリケーションです。GitHub連携機能やデータ処理、レジュメ生成機能などのサーバーサイド処理を提供します。

## 主要機能

### GitHubユーザー情報の取得

```
GET /api/github/getUser?userName={userName}
```

GitHubのユーザー情報を取得します。プロフィール情報、リポジトリ一覧、コミット履歴などが含まれます。

### ユーザー情報のSSE（Server-Sent Events）

```
GET /api/github/getUserSse?userName={userName}
```

Server-Sent Eventsを使用して、GitHubユーザー情報をリアルタイムに配信します。情報の取得状況をクライアントにストリーミングします。

### モック機能

開発やテスト用のモックAPIエンドポイントも用意されています。

## 技術スタック

- **言語**: TypeScript
- **フレームワーク**: Node.js
- **パッケージ管理**: pnpm
- **ビルドツール**: tsup
- **デプロイメント**: Docker, Google Cloud Run
- **CI/CD**: GitHub Actions

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
   pnpm dev
   ```
   APIは通常、http://localhost:3001 でアクセス可能になります。

### ビルド

```
pnpm build
```

ビルド成果物は`dist`ディレクトリに生成されます。

### テスト

```
pnpm test
```

## 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `PORT` | APIサーバーのポート番号 | `3001` |
| `GITHUB_TOKEN` | GitHub API Token | - |
| `NODE_ENV` | 実行環境 (`development`, `production`, `test`) | `development` |

## デプロイメント

このアプリケーションはDockerコンテナとして実行できるよう設定されています。

```bash
# イメージのビルド
docker build -t git-resume-api .

# コンテナの実行
docker run -p 3001:3001 -e GITHUB_TOKEN=your_token git-resume-api
```

## ディレクトリ構造

```
api/
├── src/
│   ├── routes/           # APIエンドポイント定義
│   │   ├── api/          # APIルート
│   │   │   ├── github/   # GitHub関連エンドポイント
│   │   │   └── index.ts  # APIルートの定義
│   ├── utils/            # ユーティリティ
│   └── index.ts          # エントリーポイント
├── generated/            # 生成されたコード（.gitignoreに含まれる）
├── Dockerfile            # Dockerファイル
├── package.json          # パッケージ設定
└── tsup.config.ts        # ビルド設定
```

## 関連ドキュメント

- [プロジェクト概要](/docs/guide/project-overview.md)
- [インフラストラクチャ](/infra/README.md)

## Changelog

- 2025/3/21: 初回作成
