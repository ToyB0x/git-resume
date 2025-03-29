# @resume/services 使用ガイド

**更新日**: 2025/3/29
**確認日**: 2025/3/29
**自動生成**: このドキュメントはAIによって自動生成されています

## 基本的な使用方法

@resume/servicesパッケージは、GitHubデータの取得、Git操作、レジュメ生成などの機能を提供します。以下に主要なサービスの使用方法を示します。

### サービスのインポート

必要なサービスを直接インポートして使用します：

```typescript
import { 
  githubService, 
  gitService, 
  packService, 
  resumeService, 
  summaryService 
} from "@resume/services";
```

特定のサービスのみが必要な場合は、個別にインポートすることも可能です：

```typescript
import { githubService } from "@resume/services";
import { resumeService } from "@resume/services";
```

## 主要サービスの使用例

### GitHub Service

GitHubのAPIと連携し、ユーザー情報やリポジトリデータを取得します：

```typescript
// ユーザー情報の取得
const user = await githubService.getUserDetail("example-user");

// ユーザーのコミット履歴のあるリポジトリ一覧の取得
const repositories = await githubService.getUserCommitedRepositories(
  "example-user",
  true, // publicOnly
  process.env.GITHUB_TOKEN
);

// 最近活動のあったリポジトリの取得
const recentRepos = await githubService.getUserRecentRepositories(
  "example-user",
  process.env.GITHUB_TOKEN
);
```

### Git Service

Git操作を行うためのユーティリティを提供します：

```typescript
// リポジトリのクローンまたはプル
await gitService.cloneOrPullRepository({
  id: 12345,
  owner: "example-user",
  name: "example-repo",
  isPrivate: false
});
```

### Pack Service

リポジトリのコードを解析し、パッケージ化します：

```typescript
// リポジトリのパッケージ化
await packService.create(
  "example-user",
  "./repos/example-user"
);

// パッケージの読み込み
const packs = packService.load("example-user");
```

### Summary Service

リポジトリやユーザー活動のサマリー情報を生成・管理します：

```typescript
// サマリーの作成
await summaryService.create(
  "example-user",
  pack,
  process.env.RESUME_GEMINI_API_KEY
);

// サマリーの読み込み
const summaries = summaryService.load("example-user");
```

### Resume Service

ユーザーのGitHub活動データからレジュメを生成します：

```typescript
// レジュメの生成
const resumeMarkdown = await resumeService.create(
  "example-user",
  summaries,
  process.env.RESUME_GEMINI_API_KEY
);
```

## 完全な使用例

以下は、ユーザーのGitHub情報からレジュメを生成する完全な例です：

```typescript
import { 
  githubService, 
  gitService, 
  packService, 
  summaryService, 
  resumeService 
} from "@resume/services";

async function generateResume(userName: string) {
  try {
    // 1. ユーザー情報の取得
    const user = await githubService.getUserDetail(userName);
    console.log(`Processing resume for: ${user.displayName || user.userName}`);

    // 2. リポジトリ情報の取得
    const repositories = await githubService.getUserCommitedRepositories(
      userName,
      true,
      process.env.GITHUB_TOKEN,
      ({ commitSize, repositories }) => {
        console.log(`Found ${commitSize} commits in ${repositories.length} repositories`);
      }
    );

    // 3. リポジトリのクローン
    for (const repo of repositories) {
      await gitService.cloneOrPullRepository(repo);
    }

    // 4. リポジトリのパッケージ化
    await packService.create(userName, `./repos/${userName}`);
    const packs = packService.load(userName);

    // 5. サマリーの生成
    for (const pack of packs) {
      await summaryService.create(
        userName,
        pack,
        process.env.RESUME_GEMINI_API_KEY
      );
    }
    const summaries = summaryService.load(userName);

    // 6. レジュメの生成
    const resumeMarkdown = await resumeService.create(
      userName,
      summaries,
      process.env.RESUME_GEMINI_API_KEY
    );

    return resumeMarkdown;
  } catch (error) {
    console.error("Error generating resume:", error);
    throw error;
  }
}
```

## 注意事項

- GitHub APIを使用する関数では、レート制限に注意してください。可能な限り`githubToken`パラメータを指定することをお勧めします。
- 大規模なリポジトリの処理は時間がかかる場合があります。必要に応じてタイムアウト処理を実装してください。
- API キーなどの秘密情報は環境変数で管理し、コードにハードコーディングしないでください。
- Gemini APIを使用するサービス（resumeServiceとsummaryService）では、有効なAPIキーが必要です。