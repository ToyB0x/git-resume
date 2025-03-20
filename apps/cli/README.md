# CLI Application

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

git-resumeプロジェクトのコマンドラインインターフェースアプリケーションです。GitHubの活動履歴の取得、レジュメ生成、リポジトリ分析などの機能をコマンドラインから利用できます。

## 主要コマンド

git-resume CLIは以下の主要コマンドを提供しています：

### clone

GitHubリポジトリをクローンまたは更新します。

```bash
# 使用方法
git-resume clone <username/repository>

# 例
git-resume clone ToyB0x/git-resume
```

### pack

リポジトリのコードを解析・パッケージ化し、AIによる理解や処理がしやすい形式に変換します。

```bash
# 使用方法
git-resume pack create --repository <repository-path>

# 例
git-resume pack create --repository ./my-project
```

### resume

ユーザーのGitHub活動からレジュメを生成します。

```bash
# 使用方法
git-resume resume create --user <username>

# 例
git-resume resume create --user ToyB0x
```

### summary

リポジトリやユーザー活動のサマリー情報を生成します。

```bash
# 使用方法
git-resume summary create --repository <repository-path>

# 例
git-resume summary create --repository ./my-project
```

## インストール方法

### NPM からのインストール

```bash
npm install -g @resume/cli
```

### ソースからのビルド

```bash
# リポジトリのクローン
git clone https://github.com/ToyB0x/git-resume.git

# 依存パッケージのインストール
cd git-resume
pnpm install

# CLIのビルド
pnpm build --filter=cli

# グローバルにリンク
cd apps/cli
npm link
```

## 技術スタック

- **言語**: TypeScript
- **パッケージ管理**: pnpm
- **ビルドツール**: tsup
- **CLI フレームワーク**: commander.js (予想)

## 開発方法

### 必要条件

- Node.js v22.x
- pnpm v10.4.1以上

### ローカル開発

1. 依存パッケージのインストール:
   ```
   pnpm install
   ```

2. 開発モードでの実行:
   ```
   pnpm dev --filter=cli
   ```

3. ビルド:
   ```
   pnpm build --filter=cli
   ```

### 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `GITHUB_TOKEN` | GitHub API Token | - |
| `NODE_ENV` | 実行環境 (`development`, `production`, `test`) | `development` |

## ディレクトリ構造

```
cli/
├── src/
│   ├── commands/         # CLI コマンド定義
│   │   ├── clone/        # リポジトリクローンコマンド
│   │   ├── pack/         # パッケージ化コマンド
│   │   ├── resume/       # レジュメ生成コマンド
│   │   ├── summary/      # サマリー生成コマンド
│   │   └── index.ts      # コマンド登録
│   ├── utils/            # ユーティリティ
│   └── index.ts          # エントリーポイント
├── generated/            # 生成されたコード（.gitignoreに含まれる）
├── package.json          # パッケージ設定
└── tsup.config.ts        # ビルド設定
```

## 関連ドキュメント

- [プロジェクト概要](/docs/guide/project-overview.md)
- [APIアプリケーション](/apps/api/README.md)

## Changelog

- 2025/3/21: 初回作成
