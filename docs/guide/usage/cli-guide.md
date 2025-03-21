# CLIツール使用ガイド

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

git-resume CLIツールは、コマンドラインから簡単にGitHub活動データを分析し、レジュメを生成するためのツールです。このガイドではCLIツールのインストール方法、基本的なコマンド、活用方法について説明します。

## インストール方法

### グローバルインストール

```bash
# GitHubリポジトリからクローン
git clone https://github.com/ToyB0x/git-resume.git
cd git-resume

# 依存関係のインストールとビルド
pnpm install
pnpm build --filter=cli

# グローバルにリンク
cd apps/cli
npm link
```

これにより、`git-resume`コマンドがグローバルに使用可能になります。

### 環境変数の設定

GitHubのAPIにアクセスするため、以下の環境変数を設定する必要があります：

```bash
# macOS/Linux
export GITHUB_TOKEN=your_personal_access_token

# Windows (CMD)
set GITHUB_TOKEN=your_personal_access_token

# Windows (PowerShell)
$env:GITHUB_TOKEN="your_personal_access_token"
```

GitHubの個人アクセストークンは、[GitHubの設定ページ](https://github.com/settings/tokens)から作成できます。少なくとも`repo`スコープ（`public_repo`でも可）が必要です。

## 基本的なコマンド

### ヘルプの表示

```bash
# 利用可能なコマンドの一覧を表示
git-resume --help

# 特定のコマンドのヘルプを表示
git-resume clone --help
git-resume pack --help
git-resume resume --help
```

### リポジトリのクローン

GitHub上のリポジトリをローカルにクローンします。

```bash
# 単一リポジトリのクローン
git-resume clone <username/repository>

# 例
git-resume clone ToyB0x/git-resume
```

### リポジトリのパッケージ化

クローンしたリポジトリを分析用にパッケージ化します。

```bash
# リポジトリをパッケージ化
git-resume pack create --repository <repository-path>

# 例
git-resume pack create --repository ./git-resume
```

パッケージ化されたデータは、後のレジュメ生成やサマリー生成のプロセスで使用されます。

### サマリーの生成

リポジトリの内容からサマリーを生成します。

```bash
# サマリーを生成
git-resume summary create --repository <repository-path>

# 例
git-resume summary create --repository ./git-resume
```

サマリーには、リポジトリの機能、技術スタック、アーキテクチャなどの概要が含まれます。

### レジュメの生成

GitHubユーザーのレジュメを生成します。

```bash
# レジュメを生成
git-resume resume create --user <username>

# 例
git-resume resume create --user ToyB0x
```

生成されたレジュメは、デフォルトでは`./generated/resumes/<username>.md`に保存されます。

## 高度なオプション

### 出力形式の指定

```bash
# Markdown形式で出力
git-resume resume create --user <username> --format markdown

# HTML形式で出力
git-resume resume create --user <username> --format html

# PDF形式で出力（PDFレンダリングが有効な場合）
git-resume resume create --user <username> --format pdf
```

### 出力先の指定

```bash
# 出力先ディレクトリを指定
git-resume resume create --user <username> --output ./my-resumes/

# 出力ファイル名を指定
git-resume resume create --user <username> --output ./my-resume.md
```

### 分析対象の絞り込み

```bash
# 特定の期間のデータのみを分析
git-resume resume create --user <username> --start-date 2023-01-01 --end-date 2023-12-31

# 特定のリポジトリのみを分析
git-resume resume create --user <username> --include-repos "repo1,repo2,repo3"

# 特定のリポジトリを除外
git-resume resume create --user <username> --exclude-repos "personal,test,temp"
```

### デバッグモード

問題が発生した場合は、デバッグモードを有効にして詳細なログを確認できます。

```bash
git-resume resume create --user <username> --debug
```

## 実行フロー例

典型的な使用例として、以下の手順でレジュメを生成します：

1. リポジトリのクローン
   ```bash
   git-resume clone ToyB0x/git-resume
   ```

2. リポジトリのパッケージ化
   ```bash
   git-resume pack create --repository ./git-resume
   ```

3. サマリーの生成
   ```bash
   git-resume summary create --repository ./git-resume
   ```

4. レジュメの生成
   ```bash
   git-resume resume create --user ToyB0x
   ```

## トラブルシューティング

CLI使用時の一般的な問題と解決方法については、[トラブルシューティングガイド](/docs/guide/troubleshooting.md)の「CLIツールの問題」セクションを参照してください。

## 次のステップ

- [Webアプリケーションガイド](/docs/guide/usage/web-guide.md)でGUIベースの操作方法を学ぶ
- [レジュメ生成機能ガイド](/docs/guide/features/resume-generation.md)でレジュメのカスタマイズ方法を確認
- [API仕様書](/docs/api/README.md)でプログラマティックな操作方法を学ぶ

## Changelog

- 2025/3/21: 初回作成
