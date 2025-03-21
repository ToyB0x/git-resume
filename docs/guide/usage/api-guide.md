# APIガイド

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

git-resumeは、GitHubユーザーのレジュメを生成するためのRESTful APIを提供しています。このガイドでは、APIの基本的な使用方法と主要なエンドポイントについて説明します。

## APIアクセス方法

### ベースURL

開発環境では以下のURLでアクセス可能です：

```
http://localhost:3001
```

### 認証

現在のバージョンでは、APIキーによる認証は実装されていません。ただし、GitHubのデータにアクセスするためには、APIサーバー側で適切なGitHubトークンが設定されている必要があります。

## 主要エンドポイント

### レジュメ取得・生成

```
GET /api/github/getUser/:userName
```

指定したGitHubユーザーのレジュメを生成または取得します。

**パラメータ**:

| 名前 | 場所 | 必須 | 説明 |
|------|------|------|------|
| `userName` | URLパラメータ | 必須 | GitHubユーザー名（3文字以上） |

**リクエスト例**:

```
GET /api/github/getUser/ToyB0x
```

**レスポンス例**:

```json
{
  "markdown": "# ToyB0xのレジュメ\n\n## スキル\n\nTypeScript, React, Node.js...(以下レジュメ内容)"
}
```

**注意事項**:
- 初回アクセス時や更新時は、レジュメ生成に数分かかる場合があります
- `userName`に"demo"を指定すると、モックデータが返されます

### レジュメ生成の進捗状況取得 (Server-Sent Events)

```
GET /api/github/:userName/progress
```

Server-Sent Events (SSE) を使用して、レジュメ生成プロセスの進捗状況をリアルタイムに受信します。

**パラメータ**:

| 名前 | 場所 | 必須 | 説明 |
|------|------|------|------|
| `userName` | URLパラメータ | 必須 | GitHubユーザー名（3文字以上） |

**クライアント側の実装例**:

```javascript
// JavaScript
const eventSource = new EventSource(`/api/github/ToyB0x/progress`);

// 接続イベント
eventSource.addEventListener('connected', (event) => {
  const data = JSON.parse(event.data);
  console.log('Connected:', data.message);
});

// 進捗状況イベント
eventSource.addEventListener('resume_progress', (event) => {
  const progress = JSON.parse(event.data);
  
  switch(progress.type) {
    case 'GitSearch':
      console.log(`Found ${progress.foundRepositories.length} repositories`);
      break;
    case 'GitClone':
      console.log(`Cloning repositories...`);
      break;
    case 'Analyze':
      console.log(`Analyzing repositories...`);
      break;
    case 'CreateSummary':
      console.log(`Creating summaries...`);
      break;
    case 'CreatingResume':
      console.log(`Generating resume...`);
      break;
    case 'Complete':
      console.log(`Resume complete!`);
      eventSource.close(); // 完了したら接続を閉じる
      break;
  }
});

// エラーハンドリング
eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
  eventSource.close();
};
```

## レスポンス形式

### 成功レスポンス

APIは成功時に適切なHTTPステータスコード（通常は`200 OK`）と、JSONフォーマットのレスポンスを返します。

### エラーレスポンス

エラーが発生した場合、適切なHTTPステータスコードとエラーメッセージを含むJSONレスポンスが返されます：

```json
{
  "error": "エラーメッセージ"
}
```

一般的なエラーコード：

- `400 Bad Request`: 不正なリクエストパラメータ（例：短すぎるユーザー名）
- `404 Not Found`: 要求されたリソースが見つからない
- `500 Internal Server Error`: サーバー内部エラー

## 使用例

### cURLを使ったレジュメ取得

```bash
curl -X GET "http://localhost:3001/api/github/getUser/ToyB0x"
```

### フェッチAPIを使ったレジュメ取得

```javascript
async function fetchResume(userName) {
  try {
    const response = await fetch(`http://localhost:3001/api/github/getUser/${userName}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    return data.markdown;
  } catch (error) {
    console.error('Failed to fetch resume:', error);
    return null;
  }
}
```

## 注意事項と制限

- 大規模なGitHubアカウントの場合、初回レジュメ生成に時間がかかる場合があります
- GitHubのAPIレート制限により、短時間に多数のリクエストを行うと失敗する場合があります
- 現在はMarkdown形式のレジュメのみがサポートされています
- APIの詳細な仕様は今後のバージョンで変更される可能性があります

## 関連情報

- [CLIツールガイド](/docs/guide/usage/cli-guide.md)
- [Webアプリケーションガイド](/docs/guide/usage/web-guide.md)
- [トラブルシューティング](/docs/guide/troubleshooting.md)

## Changelog

- 2025/3/21: 初回作成（docs/api/README.md から移動・再構成）
