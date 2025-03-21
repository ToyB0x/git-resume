# API 仕様書

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

git-resumeプロジェクトのAPIサービスは、GitHubユーザー情報の取得、リポジトリデータの分析、レジュメ生成などの機能を提供します。このドキュメントでは、利用可能なAPIエンドポイント、リクエスト/レスポンス形式、認証方法、エラー処理などについて説明します。

## ベースURL

```
開発環境: http://localhost:3001
本番環境: https://api.git-resume.example.com
```

## 認証

現在のバージョンでは、以下の認証方法をサポートしています：

- **GitHub Token**: 一部のエンドポイントでは、GitHub APIへのアクセスにGitHub Tokenが必要です
- **APIキー認証**: 将来実装予定

## エンドポイント一覧

### GitHub関連エンドポイント

#### ユーザー情報の取得

```
GET /api/github/getUser
```

指定されたGitHubユーザーの情報を取得します。

**パラメータ**:

| 名前 | 必須 | 説明 |
|------|------|------|
| `userName` | 必須 | GitHubユーザー名 |

**レスポンス例**:

```json
{
  "id": 12345,
  "userName": "example-user",
  "displayName": "Example User",
  "blog": "https://example.com",
  "avatarUrl": "https://github.com/example-user.png"
}
```

#### ユーザーコミットリポジトリの取得

```
GET /api/github/getUserCommitedRepositories
```

ユーザーがコミットしたリポジトリの一覧を取得します。

**パラメータ**:

| 名前 | 必須 | 説明 |
|------|------|------|
| `userName` | 必須 | GitHubユーザー名 |
| `limit` | オプション | 取得するリポジトリの最大数（デフォルト: 10） |

**レスポンス例**:

```json
[
  {
    "id": 98765,
    "name": "example-repo",
    "fullName": "example-user/example-repo",
    "description": "An example repository",
    "url": "https://github.com/example-user/example-repo",
    "language": "TypeScript",
    "stars": 42,
    "forks": 10,
    "lastUpdated": "2025-03-15T10:00:00Z"
  }
]
```

#### 最近のリポジトリの取得

```
GET /api/github/getUserRecentRepositories
```

ユーザーの最近活動のあったリポジトリを取得します。

**パラメータ**:

| 名前 | 必須 | 説明 |
|------|------|------|
| `userName` | 必須 | GitHubユーザー名 |
| `limit` | オプション | 取得するリポジトリの最大数（デフォルト: 5） |

**レスポンス例**: getUserCommitedRepositoriesと同様

#### ユーザー情報のSSE（Server-Sent Events）

```
GET /api/github/getUserSse
```

Server-Sent Eventsを使用して、GitHubユーザー情報をリアルタイムに配信します。

**パラメータ**:

| 名前 | 必須 | 説明 |
|------|------|------|
| `userName` | 必須 | GitHubユーザー名 |

**レスポンス**:

SSEストリームとして、以下のようなイベントを配信します：

```
event: user
data: {"id":12345,"userName":"example-user",...}

event: repositories
data: [{"id":98765,"name":"example-repo",...}]

event: complete
data: {"status":"success"}
```

### レジュメ関連エンドポイント

#### レジュメの生成

```
POST /api/resume/create
```

GitHubユーザーの活動データからレジュメを生成します。

**リクエスト本文**:

```json
{
  "userName": "example-user",
  "options": {
    "includePrivateRepos": false,
    "format": "markdown"
  }
}
```

**レスポンス例**:

```json
{
  "id": "resume-12345",
  "userName": "example-user",
  "generatedAt": "2025-03-21T09:00:00Z",
  "content": "# Example User\n\n## Skills\n\nTypeScript, React, Node.js...",
  "metadata": {
    "repositoriesAnalyzed": 15,
    "commitsAnalyzed": 500
  }
}
```

#### レジュメの取得

```
GET /api/resume/get
```

既に生成されたレジュメを取得します。

**パラメータ**:

| 名前 | 必須 | 説明 |
|------|------|------|
| `id` | 必須 | レジュメID |

**レスポンス例**: レジュメ生成と同様

### サマリー関連エンドポイント

#### サマリーの生成

```
POST /api/summary/create
```

リポジトリのコードや活動データからサマリーを生成します。

**リクエスト本文**:

```json
{
  "repositoryUrl": "https://github.com/example-user/example-repo",
  "options": {
    "includeCodeAnalysis": true,
    "includeContributionAnalysis": true
  }
}
```

**レスポンス例**:

```json
{
  "id": "summary-12345",
  "repositoryName": "example-repo",
  "generatedAt": "2025-03-21T09:30:00Z",
  "languages": {
    "TypeScript": 60,
    "JavaScript": 30,
    "CSS": 10
  },
  "codeMetrics": {
    "linesOfCode": 5000,
    "functions": 120,
    "classes": 15
  },
  "topContributors": [
    {
      "userName": "example-user",
      "contributions": 150
    }
  ]
}
```

## エラーレスポンス

APIはエラーが発生した場合、適切なHTTPステータスコードと以下の形式のJSONレスポンスを返します：

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "details": "GitHub user 'non-existent-user' does not exist"
  }
}
```

一般的なエラーコード：

| コード | 説明 |
|--------|------|
| `INVALID_REQUEST` | リクエストパラメータが無効 |
| `NOT_FOUND` | 要求されたリソースが見つからない |
| `GITHUB_API_ERROR` | GitHub APIとの通信中にエラーが発生 |
| `RATE_LIMIT_EXCEEDED` | APIレート制限を超過 |
| `INTERNAL_ERROR` | 内部サーバーエラー |

## レート制限

APIの安定性を確保するため、以下のレート制限が適用されます：

- 認証なし: 60リクエスト/時間
- APIキー認証: 1000リクエスト/時間

レート制限に関する情報はレスポンスヘッダーに含まれます：

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1616876400
```

## バージョニング

APIのバージョニングは現在URLパスに含まれていませんが、将来的には以下の形式が採用される予定です：

```
/api/v1/github/getUser
```

## Changelog

- 2025/3/21: 初回作成
