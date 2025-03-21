# API Application

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

git-resumeプロジェクトのバックエンドAPIアプリケーションです。GitHub連携機能やデータ処理、レジュメ生成機能などのサーバーサイド処理を提供します。

## 主要機能

### GitHubユーザー情報の取得

```
GET /api/github/getUser/:userName
```

GitHubのユーザー情報を取得し、自動的にレジュメを生成します。プロフィール情報、リポジトリ一覧、コミット履歴の分析などが含まれます。

### ユーザー情報のSSE（Server-Sent Events）

```
GET /api/github/:userName/progress
```

Server-Sent Eventsを使用して、GitHubユーザー情報とレジュメ生成プロセスをリアルタイムに配信します。情報の取得や処理状況をクライアントにストリーミングします。

### モック機能

開発やテスト用のモックAPIエンドポイントも用意されています。`demo`というユーザー名を使用することで、実際のGitHub APIを呼び出さずにモックデータが返されます。

## 技術スタック

- **言語**: TypeScript
- **フレームワーク**: Node.js, [Hono.js](https://honojs.dev/) (高速なWebフレームワーク)
- **バリデーション**: [Valibot](https://valibot.dev/) (軽量バリデーションライブラリ)
- **リアルタイム通信**: Server-Sent Events (SSE)
- **並行処理**: [@supercharge/promise-pool](https://github.com/supercharge/promise-pool)
- **外部通信**: node:child_process (CLIコマンド実行)
- **パッケージ管理**: pnpm
- **ビルドツール**: tsup
- **デプロイメント**: Docker, Google Cloud Run
- **CI/CD**: GitHub Actions

## 実装詳細

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

## 開発方法

### 必要条件

- Node.js v22.x
- pnpm v10.4.1以上
- 環境変数:
  - `GITHUB_TOKEN`: GitHub APIへのアクセスに使用されるトークン
  - `RESUME_GEMINI_API_KEY`: Google Gemini APIへのアクセスに使用されるAPIキー（サマリー生成に使用）
  - `PORT`: APIサーバーのポート番号（デフォルト: `3001`）
  - `NODE_ENV`: 実行環境 (`development`, `production`, `test`) | デフォルト: `development`

### ローカル開発

1. 依存パッケージのインストール:
   ```
   pnpm install
   ```

2. 開発サーバーの起動:
   ```
   pnpm dev --filter=api
   ```
   APIは通常、http://localhost:3001 でアクセス可能になります。

3. 特定のポートで起動（デフォルトは3001）:
   ```bash
   PORT=8080 pnpm dev --filter=api
   ```

### ビルド

```
pnpm build --filter=api
```

ビルド成果物は`dist`ディレクトリに生成されます。

### テスト

```
pnpm test --filter=api
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

## デプロイメント

このアプリケーションはDockerコンテナとして実行できるよう設定されています。

```bash
# イメージのビルド
docker build -t git-resume-api .

# コンテナの実行
docker run -p 3001:3001 -e GITHUB_TOKEN=your_token -e RESUME_GEMINI_API_KEY=your_key git-resume-api
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
│   │   ├── env.ts        # 環境変数ヘルパー
│   │   ├── index.ts      # ユーティリティエクスポート
│   │   └── sseHelper.ts  # SSEヘルパー関数
│   └── index.ts          # エントリーポイント
├── generated/            # 生成されたコード（.gitignoreに含まれる）
├── Dockerfile            # Dockerファイル
├── package.json          # パッケージ設定
└── tsup.config.ts        # ビルド設定
```

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

## 関連ドキュメント

- [プロジェクト概要](/docs/guide/project-overview.md)
- [APIユーザーガイド](/docs/guide/usage/api-guide.md)
- [インフラストラクチャ](/infra/README.md)

## Changelog

- 2025/3/21: API実装詳細を統合（docs/dev-guide/api-implementation.md の内容を移動）
- 2025/3/21: 初回作成
