# API 仕様書

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

git-resumeプロジェクトのAPIサービスは、GitHubユーザー情報の取得、リポジトリデータの分析、レジュメ生成などの機能を提供します。このドキュメントでは、実際のコードベース分析に基づいた現在実装済みのAPIエンドポイント、リクエスト/レスポンス形式、エラー処理などについて説明します。

## ベースURL

開発環境では以下のURLでアクセス可能です：

```
http://localhost:3001
```

## 環境変数

APIサーバーが動作するためには、以下の環境変数が必要です：

- `GITHUB_TOKEN`: GitHub APIへのアクセスに使用されるトークン
- `RESUME_GEMINI_API_KEY`: Google Gemini APIへのアクセスに使用されるAPIキー

## エンドポイント一覧

### GitHub関連エンドポイント

#### レジュメ取得・生成 API

```
GET /api/github/getUser/:userName
```

GitHubユーザーの活動データからレジュメを生成し、マークダウン形式で返します。このエンドポイントはCLIツールを内部的に呼び出し、リポジトリのクローン、パッケージ化、サマリー生成、レジュメ生成の一連のプロセスを実行します。

**パラメータ**:

| 名前 | 場所 | 必須 | 説明 |
|------|------|------|------|
| `userName` | URLパラメータ | 必須 | GitHubユーザー名（3文字以上） |

**レスポンス**:

成功時のステータスコード: `200 OK`

成功時のレスポンス本文:
```json
{
  "markdown": "# ユーザーのレジュメ\n\n## スキル\n\nTypeScript, React, Node.js...(以下レジュメ内容)"
}
```

**内部実装の詳細**:

このエンドポイントは内部で以下のCLIコマンドを順次実行します：

1. `pnpm --filter @survive/cli-github jobs clone repositories <userName> --public-only`
2. `pnpm --filter @survive/cli-github jobs pack create <userName>`
3. `pnpm --filter @survive/cli-github jobs summary create <userName> --skip-confirm`
4. `pnpm --filter @survive/cli-github jobs resume create <userName> --skip-confirm`

生成されたレジュメは`../cli-github/generated/resumes/<userName>.md`ファイルから読み込まれます。

**特記事項**:
- `userName`が"demo"の場合、モックデータが返され、CLIコマンドは実行されません。
- バリデーションにvalibot（Valibot）を使用して、ユーザー名が3文字以上であることを検証します。

#### レジュメ生成プロセスのリアルタイム更新 (SSE)

```
GET /api/github/:userName/progress
```

Server-Sent Events (SSE)を使用して、レジュメ生成プロセスの進捗状況をリアルタイムに配信します。このAPIは長時間実行プロセスの進捗状況をクライアントにイベントストリームとして送信します。

**パラメータ**:

| 名前 | 場所 | 必須 | 説明 |
|------|------|------|------|
| `userName` | URLパラメータ | 必須 | GitHubユーザー名（3文字以上） |

**レスポンス**:

SSEストリームとして、以下のイベントタイプが送信されます：

1. **CONNECTED**: ストリーム接続確立イベント
   ```
   event: connected
   data: {"message":"Connected to resume generation stream for user: username"}
   ```

2. **RESUME_PROGRESS**: 進捗状況更新イベント（状態によって内容が変化）
   
   a. **GitSearch** 状態（リポジトリ検索）
   ```
   event: resume_progress
   data: {"type":"GitSearch","foundCommitSize":150,"foundRepositories":["user/repo1","user/repo2"]}
   ```
   
   b. **GitClone** 状態（リポジトリクローン）
   ```
   event: resume_progress
   data: {"type":"GitClone","repositories":[{"name":"user/repo1","state":"cloned","updatedAt":"2025-03-21T01:23:45.789Z"},{"name":"user/repo2","state":"waiting","updatedAt":"2025-03-21T01:23:45.789Z"}]}
   ```
   
   c. **Analyze** 状態（リポジトリ分析）
   ```
   event: resume_progress
   data: {"type":"Analyze","repositories":[{"name":"user/repo1","state":"analyzed","updatedAt":"2025-03-21T01:24:45.789Z"},{"name":"user/repo2","state":"waiting","updatedAt":"2025-03-21T01:23:45.789Z"}]}
   ```
   
   d. **CreateSummary** 状態（サマリー生成）
   ```
   event: resume_progress
   data: {"type":"CreateSummary","repositories":[{"name":"user/repo1","state":"summarized","updatedAt":"2025-03-21T01:25:45.789Z"},{"name":"user/repo2","state":"waiting","updatedAt":"2025-03-21T01:23:45.789Z"}]}
   ```
   
   e. **CreatingResume** 状態（レジュメ生成中）
   ```
   event: resume_progress
   data: {"type":"CreatingResume"}
   ```
   
   f. **Complete** 状態（完了）
   ```
   event: resume_progress
   data: {"type":"Complete","markdown":"# ユーザーのレジュメ\n\n...(レジュメ全文)"}
   ```

**内部実装の詳細**:

このエンドポイントでは、Hono.jsの`streamSSE`機能を使用して、レジュメ生成プロセスの各ステップをイベントとして配信します。プロセス中に以下の処理を順次実行します：

1. ユーザーのコントリビュートリポジトリを検索
2. 各リポジトリをクローンまたは更新（並行処理）
3. 各リポジトリをパッケージ化（並行処理）
4. Google Gemini APIを使用して各リポジトリのサマリーを生成
5. サマリーを統合してレジュメを生成
6. 完成したレジュメをイベントデータとして送信

各ステップは専用の状態型（StateType）を使用して進捗状況を表現し、`sendTypedEvent`関数を使用してクライアントにイベントを送信します。

**特記事項**:
- `userName`が"demo"の場合、実際のAPIコールを行わずモックプロセスでイベントが生成されます
- サマリー生成時のレート制限問題を避けるために、一時的な遅延（10秒）が実装されています
- `PromisePool`を使用して並行処理の制御（最大3並行）を行っています

## エラー処理

APIはエラーが発生した場合、適切なHTTPステータスコードとエラーメッセージを含むJSONレスポンスを返します：

- `400 Bad Request`: 不正なリクエストパラメータ（例：短すぎるユーザー名）
- `404 Not Found`: 要求されたリソースが見つからない
- `500 Internal Server Error`: サーバー内部エラー

SSEストリームの場合は、エラーメッセージがプレーンテキストとして送信され、その後ストリームが閉じられます。

## 技術仕様

このAPIは以下の技術スタックを使用しています：

- **Hono.js**: 高速なWebフレームワーク
- **Valibot**: 軽量バリデーションライブラリ
- **Server-Sent Events**: リアルタイム進捗更新の配信
- **pnpm**: パッケージマネージャー兼CLIコマンド実行
- **node:child_process**: 子プロセスでのCLIコマンド実行
- **@supercharge/promise-pool**: 並行処理の制御

## Changelog

- 2025/3/21: コードベース分析に基づき内容を更新
- 2025/3/21: 初回作成
