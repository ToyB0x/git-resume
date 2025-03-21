# API実装詳細

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

git-resumeプロジェクトのAPIサービスは、GitHubユーザー情報の取得、リポジトリデータの分析、レジュメ生成などの機能を提供します。このドキュメントでは、APIの技術的な実装詳細について開発者向けに説明します。

## 技術スタック

APIサーバーは以下の技術スタックを使用しています：

- **Hono.js**: 高速なWebフレームワーク
- **Valibot**: 軽量バリデーションライブラリ
- **Server-Sent Events (SSE)**: リアルタイム進捗更新の配信
- **node:child_process**: 子プロセスでのCLIコマンド実行
- **@supercharge/promise-pool**: 並行処理の制御

## 環境設定

### 必要な環境変数

APIサーバーが動作するためには、以下の環境変数が必要です：

- `GITHUB_TOKEN`: GitHub APIへのアクセスに使用されるトークン
- `RESUME_GEMINI_API_KEY`: Google Gemini APIへのアクセスに使用されるAPIキー（サマリー生成に使用）

### 開発環境のセットアップ

```bash
# APIサーバーの起動
pnpm dev --filter=api

# 特定のポートで起動（デフォルトは3001）
PORT=8080 pnpm dev --filter=api
```

## エンドポイントの実装詳細

### レジュメ取得・生成 API

```
GET /api/github/getUser/:userName
```

#### 実装概要

このエンドポイントは、Hono.jsのルーターとバリデーションミドルウェアを使用して実装されています。

```typescript
// routes/api/github/index.ts
app.get('/getUser/:userName', async (c) => {
  const { userName } = c.req.param();
  
  // バリデーション
  const result = safeParse(userNameSchema, userName);
  if (!result.success) {
    return c.json({ error: 'Invalid username' }, 400);
  }
  
  // モックモードのチェック
  if (userName === 'demo') {
    return c.json({ markdown: MOCK_RESUME_MARKDOWN });
  }
  
  try {
    // CLIプロセスの実行
    await executeCliCommand(`pnpm --filter @survive/cli-github jobs clone repositories ${userName} --public-only`);
    await executeCliCommand(`pnpm --filter @survive/cli-github jobs pack create ${userName}`);
    await executeCliCommand(`pnpm --filter @survive/cli-github jobs summary create ${userName} --skip-confirm`);
    await executeCliCommand(`pnpm --filter @survive/cli-github jobs resume create ${userName} --skip-confirm`);
    
    // 生成されたファイルの読み込み
    const markdown = await readResumeFile(userName);
    return c.json({ markdown });
  } catch (error) {
    console.error('Error generating resume:', error);
    return c.json({ error: 'Failed to generate resume' }, 500);
  }
});
```

#### 内部ヘルパー関数

```typescript
// CLI実行用ヘルパー関数
async function executeCliCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command execution error: ${error.message}`);
        console.error(`Command stderr: ${stderr}`);
        return reject(error);
      }
      console.log(`Command stdout: ${stdout}`);
      resolve();
    });
  });
}

// レジュメファイル読み込み用ヘルパー関数
async function readResumeFile(userName: string): Promise<string> {
  const filePath = `../cli-github/generated/resumes/${userName}.md`;
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading resume file: ${error}`);
    throw new Error('Resume file not found');
  }
}
```

### SSEプログレスエンドポイント

```
GET /api/github/:userName/progress
```

#### 実装概要

このエンドポイントは、Hono.jsの`streamSSE`機能を使用して実装されています。

```typescript
// routes/api/github/index.ts
app.get('/:userName/progress', (c) => {
  const { userName } = c.req.param();
  
  // バリデーション
  const result = safeParse(userNameSchema, userName);
  if (!result.success) {
    return c.body('Invalid username', 400);
  }
  
  // SSEストリームの設定
  return streamSSE(c, async (stream) => {
    // 接続イベントの送信
    stream.writeSSE({
      event: 'connected',
      data: JSON.stringify({
        message: `Connected to resume generation stream for user: ${userName}`
      })
    });
    
    try {
      // デモユーザーの場合
      if (userName === 'demo') {
        await mockProgressStream(stream);
        return;
      }
      
      // 実際のプロセスの進行
      await processResumeGeneration(userName, stream);
    } catch (error) {
      console.error('Error in progress stream:', error);
      stream.writeSSE({
        event: 'error',
        data: 'Error in resume generation process'
      });
    }
  });
});
```

#### 状態管理と型定義

```typescript
// SSEイベントの型定義（packages/models/src/events.ts）
export type StateType = 
  | { type: 'GitSearch'; foundCommitSize: number; foundRepositories: string[] }
  | { type: 'GitClone'; repositories: RepositoryState[] }
  | { type: 'Analyze'; repositories: RepositoryState[] }
  | { type: 'CreateSummary'; repositories: RepositoryState[] }
  | { type: 'CreatingResume' }
  | { type: 'Complete'; markdown: string };

export interface RepositoryState {
  name: string;
  state: 'waiting' | 'cloned' | 'analyzed' | 'summarized';
  updatedAt: string;
}
```

#### プログレス処理の実装

```typescript
// 実際の進捗処理
async function processResumeGeneration(userName: string, stream: SSEStreamTarget) {
  // リポジトリの検索
  const repositories = await findUserRepositories(userName);
  sendTypedEvent(stream, {
    type: 'GitSearch',
    foundCommitSize: repositories.reduce((sum, repo) => sum + repo.commitCount, 0),
    foundRepositories: repositories.map(r => r.fullName)
  });
  
  // リポジトリのクローン（並行処理）
  const repoStates = repositories.map(r => ({
    name: r.fullName,
    state: 'waiting' as const,
    updatedAt: new Date().toISOString()
  }));
  
  sendTypedEvent(stream, { type: 'GitClone', repositories: repoStates });
  
  await PromisePool
    .for(repositories)
    .withConcurrency(3)
    .process(async (repo, index) => {
      await cloneRepository(repo.fullName);
      repoStates[index].state = 'cloned';
      repoStates[index].updatedAt = new Date().toISOString();
      sendTypedEvent(stream, { type: 'GitClone', repositories: [...repoStates] });
    });
  
  // リポジトリの分析（並行処理）
  sendTypedEvent(stream, { type: 'Analyze', repositories: repoStates });
  
  await PromisePool
    .for(repositories)
    .withConcurrency(3)
    .process(async (repo, index) => {
      await analyzeRepository(repo.fullName);
      repoStates[index].state = 'analyzed';
      repoStates[index].updatedAt = new Date().toISOString();
      sendTypedEvent(stream, { type: 'Analyze', repositories: [...repoStates] });
    });
  
  // サマリー生成
  sendTypedEvent(stream, { type: 'CreateSummary', repositories: repoStates });
  
  await PromisePool
    .for(repositories)
    .withConcurrency(1) // レート制限回避のため並行数を制限
    .process(async (repo, index) => {
      await createSummary(repo.fullName);
      repoStates[index].state = 'summarized';
      repoStates[index].updatedAt = new Date().toISOString();
      sendTypedEvent(stream, { type: 'CreateSummary', repositories: [...repoStates] });
      
      // レート制限回避のための一時的な遅延
      await new Promise(resolve => setTimeout(resolve, 10000));
    });
  
  // レジュメ生成
  sendTypedEvent(stream, { type: 'CreatingResume' });
  await createResume(userName);
  
  // 完了
  const markdown = await readResumeFile(userName);
  sendTypedEvent(stream, { type: 'Complete', markdown });
}

// 型付きイベント送信ヘルパー
function sendTypedEvent(stream: SSEStreamTarget, state: StateType) {
  stream.writeSSE({
    event: 'resume_progress',
    data: JSON.stringify(state)
  });
}
```

## エラー処理

API全体で一貫したエラー処理を行うために、以下のようなアプローチを採用しています：

1. **入力バリデーション**
   - Valibotを使用したパラメータのバリデーション
   - バリデーションエラー時は400レスポンス

2. **例外ハンドリング**
   - try/catchブロックによる例外キャッチ
   - エラーロギングと適切なエラーレスポンス

3. **SSEでのエラー通知**
   - ストリーム中のエラーをイベントとして通知
   - エラー発生時でもストリームを適切に閉じる

## パフォーマンス最適化

### 並行処理の制御

大量のリポジトリを処理する場合に、`@supercharge/promise-pool`を使用して並行処理数を制御しています：

- リポジトリクローンと分析: 最大3並行
- サマリー生成（Gemini API呼び出し）: 1つずつ（レート制限対策）

### リソース使用量の最適化

- 子プロセスでのCLI実行により、メインプロセスのメモリ使用を抑制
- 不要なレスポンスデータの最小化
- クエリパラメータのバリデーションによる不要な処理の回避

## テスト

APIのテストには、以下のアプローチを推奨します：

1. **ユニットテスト**
   - 各ヘルパー関数のテスト
   - バリデーションロジックのテスト

2. **統合テスト**
   - モックを使用したエンドポイントテスト
   - SSEストリームのテスト

3. **エンドツーエンドテスト**
   - 実際のAPIコールと結果の検証
   - パフォーマンスとタイムアウトのテスト

## 将来の拡張計画

### 予定されている改善

1. **認証とアクセス制御**
   - APIキーベースの認証
   - レート制限の実装

2. **データキャッシング**
   - 生成済みレジュメのキャッシュ
   - GitHubデータのキャッシュ

3. **出力フォーマットの拡張**
   - HTML形式の出力対応
   - PDF形式の出力対応
   - カスタムテンプレート対応

## ユーザー向けドキュメント

API利用者向けのドキュメントは、[APIガイド](/docs/guide/usage/api-guide.md)を参照してください。

## Changelog

- 2025/3/21: 初回作成（docs/api/README.md から技術的な内容を移動・再構成）
