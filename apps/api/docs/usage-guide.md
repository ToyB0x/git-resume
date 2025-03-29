# @resume/api 使用ガイド

**更新日**: 2025/3/29
**確認日**: 2025/3/29
**自動生成**: このドキュメントはAIによって自動生成されています

## 基本的な使用方法

@resume/apiパッケージは、git-resumeプロジェクトのバックエンドAPIを提供します。以下に主要なエンドポイントの使用方法を示します。

### 前提条件

APIを実行するには、以下の環境変数が必要です：

```bash
# 必須環境変数
RESUME_ALLOWED_ORIGIN=example.com  # 許可するオリジン（CORSに使用）
RESUME_GEMINI_API_KEY=your_api_key # Google Gemini APIキー
RESUME_ENV=dev                     # 実行環境（dev, local, test, stg, prd）

# オプション環境変数
GITHUB_TOKEN=your_github_token     # GitHub APIトークン（レート制限緩和用）
```

### ローカル開発環境での起動

```bash
# 依存パッケージのインストール
pnpm install

# 開発サーバーの起動
pnpm dev --filter=api

# 特定のポートで起動（デフォルトは3000）
PORT=8080 pnpm dev --filter=api
```

## API エンドポイント

### 1. GitHubユーザー情報の取得とレジュメ生成

```
GET /api/github/:userName
```

指定したGitHubユーザーの情報を取得し、レジュメを生成します。

#### リクエスト例

```bash
curl http://localhost:3000/api/github/example-user
```

#### レスポンス例

```json
{
  "markdown": "# John Doe\n\n## Professional Summary\n\nExperienced software engineer with expertise in JavaScript, TypeScript, and React..."
}
```

#### エラーレスポンス例

```json
{
  "error": "Invalid username"
}
```

```json
{
  "error": "Failed to generate resume"
}
```

### 2. レジュメ生成プロセスのリアルタイム通知

```
GET /api/github/:userName/progress
```

Server-Sent Events（SSE）を使用して、レジュメ生成プロセスの進捗状況をリアルタイムに通知します。

#### クライアント側の実装例

```javascript
// ブラウザでのSSE接続例
const connectToSSE = (userName) => {
  const eventSource = new EventSource(`http://localhost:3000/api/github/${userName}/progress`);
  
  // 接続イベントのハンドリング
  eventSource.addEventListener('connected', (event) => {
    const data = JSON.parse(event.data);
    console.log('Connected:', data.message);
  });
  
  // 進捗イベントのハンドリング
  eventSource.addEventListener('resume_progress', (event) => {
    const state = JSON.parse(event.data);
    
    switch (state.type) {
      case 'GitSearch':
        console.log(`Found ${state.foundCommitSize} commits in ${state.foundRepositories.length} repositories`);
        break;
      case 'GitClone':
        console.log(`Cloning repositories: ${state.repositories.map(r => r.name).join(', ')}`);
        break;
      case 'Analyze':
        console.log(`Analyzing repositories: ${state.repositories.map(r => r.name).join(', ')}`);
        break;
      case 'CreateSummary':
        console.log(`Creating summaries: ${state.repositories.map(r => r.name).join(', ')}`);
        break;
      case 'CreatingResume':
        console.log('Creating final resume...');
        break;
      case 'Complete':
        console.log('Resume generation complete!');
        console.log('Resume markdown:', state.markdown);
        eventSource.close(); // 完了したら接続を閉じる
        break;
    }
  });
  
  // エラーハンドリング
  eventSource.addEventListener('error', (event) => {
    console.error('SSE Error:', event);
    eventSource.close();
  });
  
  return eventSource;
};

// 使用例
const eventSource = connectToSSE('example-user');

// 必要に応じて接続を閉じる
// eventSource.close();
```

### 3. デモモード

開発やテスト用に、実際のGitHubデータを使用せずにモックデータを返すデモモードが用意されています。

```bash
# デモモードでのリクエスト例
curl http://localhost:3000/api/github/demo
```

```bash
# デモモードでのSSE接続例
curl -N http://localhost:3000/api/github/demo/progress
```

## 応用例

### フロントエンドアプリケーションとの統合

```typescript
// React + SWRを使用した例
import useSWR from 'swr';
import { useState } from 'react';

// レジュメ取得関数
const fetchResume = async (userName) => {
  const response = await fetch(`http://localhost:3000/api/github/${userName}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch resume');
  }
  return response.json();
};

// SSE接続関数
const useResumeProgress = (userName) => {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [resumeMarkdown, setResumeMarkdown] = useState('');
  
  const startTracking = () => {
    const eventSource = new EventSource(`http://localhost:3000/api/github/${userName}/progress`);
    
    eventSource.addEventListener('resume_progress', (event) => {
      const state = JSON.parse(event.data);
      setProgress(state);
      
      if (state.type === 'Complete') {
        setIsComplete(true);
        setResumeMarkdown(state.markdown);
        eventSource.close();
      }
    });
    
    eventSource.addEventListener('error', (event) => {
      setError('Connection error');
      eventSource.close();
    });
    
    return () => {
      eventSource.close();
    };
  };
  
  return { progress, error, isComplete, resumeMarkdown, startTracking };
};

// コンポーネント例
const ResumeGenerator = ({ userName }) => {
  // 同期APIを使用する場合
  const { data, error } = useSWR(userName ? `resume/${userName}` : null, () => fetchResume(userName));
  
  // SSEを使用する場合
  const { progress, isComplete, resumeMarkdown, startTracking } = useResumeProgress(userName);
  
  return (
    <div>
      {/* UI実装 */}
    </div>
  );
};
```

## 注意事項

- GitHubのAPIレート制限に注意してください。可能な限り`GITHUB_TOKEN`環境変数を設定することをお勧めします。
- レジュメ生成プロセスは、リポジトリの数や規模によっては時間がかかる場合があります。
- SSE接続は、クライアントが接続を閉じるか、サーバー側で処理が完了するまで維持されます。
- 本番環境では、適切なCORS設定と認証メカニズムを実装することをお勧めします。