# @resume/cli 使用ガイド

**更新日**: 2025/3/29
**確認日**: 2025/3/29
**自動生成**: このドキュメントはAIによって自動生成されています

## 基本的な使用方法

@resume/cliパッケージは、GitHubの活動履歴からレジュメを生成するためのコマンドラインツールです。以下に主要なコマンドの使用方法を示します。

### 前提条件

CLIを実行するには、以下の環境変数が必要です：

```bash
# 必須環境変数
RESUME_USERNAME=your_github_username  # GitHubユーザー名
RESUME_GEMINI_API_KEY=your_api_key    # Google Gemini APIキー
RESUME_ENV=dev                        # 実行環境（dev, local, test, stg, prd）
GITHUB_TOKEN=your_github_token        # GitHub APIトークン
```

### インストール方法

#### NPMからのインストール

```bash
npm install -g @resume/cli
```

#### ソースからのビルド

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

## コマンド一覧

### 1. リポジトリクローン

GitHubユーザーの関連リポジトリを検索し、クローンします。

```bash
# 基本的な使用方法
git-resume clone repositories <userName>

# 公開リポジトリのみをクローン
git-resume clone repositories <userName> --public-only

# ghコマンドを使用してクローン（Git認証が設定されていない場合）
git-resume clone repositories <userName> --with-gh-command
```

例：
```bash
git-resume clone repositories ToyB0x --public-only
```

### 2. コード解析・パッケージ化

クローンしたリポジトリのコードを解析し、パッケージ化します。

```bash
# 基本的な使用方法
git-resume pack create <userName>
```

例：
```bash
git-resume pack create ToyB0x
```

### 3. サマリー生成

パッケージ化されたコードからサマリーを生成します。

```bash
# 基本的な使用方法
git-resume summary create <userName>

# 確認をスキップ
git-resume summary create <userName> --skip-confirm
```

例：
```bash
git-resume summary create ToyB0x --skip-confirm
```

### 4. レジュメ生成

サマリーからレジュメを生成します。

```bash
# 基本的な使用方法
git-resume resume create <userName>

# 確認をスキップ
git-resume resume create <userName> --skip-confirm
```

例：
```bash
git-resume resume create ToyB0x --skip-confirm
```

## 完全なワークフロー例

以下は、GitHubユーザーのレジュメを生成する完全なワークフロー例です：

```bash
# 1. 環境変数の設定
export RESUME_USERNAME=ToyB0x
export RESUME_GEMINI_API_KEY=your_api_key
export RESUME_ENV=dev
export GITHUB_TOKEN=your_github_token

# 2. リポジトリのクローン
git-resume clone repositories ToyB0x --public-only

# 3. コード解析・パッケージ化
git-resume pack create ToyB0x

# 4. サマリー生成
git-resume summary create ToyB0x --skip-confirm

# 5. レジュメ生成
git-resume resume create ToyB0x --skip-confirm

# 6. 生成されたレジュメの確認
cat ./generated/resumes/ToyB0x.md
```

## シェルスクリプトでの自動化例

以下は、複数のユーザーのレジュメを生成するシェルスクリプト例です：

```bash
#!/bin/bash
# resume-generator.sh

# 環境変数の設定
export RESUME_GEMINI_API_KEY=your_api_key
export RESUME_ENV=dev
export GITHUB_TOKEN=your_github_token

# ユーザーリスト
USERS=("user1" "user2" "user3")

for user in "${USERS[@]}"; do
  echo "Generating resume for $user..."
  
  # ユーザー名の設定
  export RESUME_USERNAME=$user
  
  # レジュメ生成ワークフロー
  git-resume clone repositories $user --public-only
  git-resume pack create $user
  git-resume summary create $user --skip-confirm
  git-resume resume create $user --skip-confirm
  
  echo "Resume generated for $user: ./generated/resumes/$user.md"
  echo "-----------------------------------"
done

echo "All resumes generated successfully!"
```

## CI/CDパイプラインでの使用例

以下は、GitHub Actionsでレジュメを自動生成する例です：

```yaml
# .github/workflows/generate-resume.yml
name: Generate Resume

on:
  schedule:
    - cron: '0 0 1 * *'  # 毎月1日の00:00に実行
  workflow_dispatch:      # 手動実行も可能

jobs:
  generate-resume:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: npm install -g @resume/cli
        
      - name: Generate resume
        env:
          RESUME_USERNAME: ${{ github.repository_owner }}
          RESUME_GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          RESUME_ENV: prod
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          git-resume clone repositories $RESUME_USERNAME --public-only
          git-resume pack create $RESUME_USERNAME
          git-resume summary create $RESUME_USERNAME --skip-confirm
          git-resume resume create $RESUME_USERNAME --skip-confirm
          
      - name: Upload resume
        uses: actions/upload-artifact@v3
        with:
          name: resume
          path: ./generated/resumes/${{ github.repository_owner }}.md
```

## 注意事項

- GitHubのAPIレート制限に注意してください。`GITHUB_TOKEN`環境変数を設定することで、レート制限を緩和できます。
- Gemini APIの使用には有効なAPIキーが必要です。
- レジュメ生成プロセスは、リポジトリの数や規模によっては時間がかかる場合があります。
- 生成されたレジュメは`./generated/resumes/`ディレクトリに保存されます。
- ログファイルは`./generated/logs/`ディレクトリに保存されます。