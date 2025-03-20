# Services Package

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

このパッケージは、git-resumeプロジェクトで使用される共通サービス機能を提供します。GitHub連携、Git操作、データ処理など、複数のアプリケーション間で共有される機能が含まれています。

## 主要サービス

### GitHub Service

GitHubのAPIと連携し、ユーザー情報やリポジトリデータを取得するサービスです。

```typescript
// サービスインターフェース
interface GithubService {
  getUserDetail: (userName: string) => Promise<User>;
  getUserCommitedRepositories: (userName: string) => Promise<Repository[]>;
  getUserRecentRepositories: (userName: string) => Promise<Repository[]>;
  cloneOrPullRepositories: (repository: Repository) => Promise<void>;
}
```

主な機能：
- ユーザープロフィール情報の取得
- ユーザーのコミット履歴のあるリポジトリ一覧の取得
- 最近活動のあったリポジトリの取得
- リポジトリのクローンまたはプル

### Git Service

Git操作を行うためのユーティリティサービスです。

```typescript
// 主な機能
cloneOrPullRepository(repository: Repository): Promise<void>
```

リポジトリのクローンや最新情報の取得（pull）を行います。

### Pack Service

リポジトリのコードを解析し、パッケージ化するサービスです。

```typescript
// 主な機能
create(repository: Repository): Promise<Pack>
load(packId: string): Promise<Pack>
```

コードの構造や特徴を分析し、AIによる理解や処理がしやすい形式に変換します。

### Resume Service

ユーザーのGitHub活動データからレジュメを生成するサービスです。

```typescript
// 主な機能
create(user: User, options?: ResumeOptions): Promise<Resume>
```

GitHub上の活動履歴、スキル、プロジェクト貢献などを分析し、プロフェッショナルなレジュメを自動生成します。

### Summary Service

リポジトリやユーザー活動のサマリー情報を生成・管理するサービスです。

```typescript
// 主な機能
create(repository: Repository): Promise<Summary>
load(summaryId: string): Promise<Summary>
```

コードや活動データを分析し、スキルセットや技術的特徴を抽出・可視化します。

## 使用方法

```typescript
import { gitHubService, resumeService } from "@resume/services";

// GitHub APIからユーザー情報を取得
const user = await gitHubService.getUserDetail("example-user");

// ユーザーのリポジトリ情報を取得
const repositories = await gitHubService.getUserCommitedRepositories("example-user");

// レジュメを生成
const resume = await resumeService.create(user);
```

## 依存関係

- `@resume/models`: データモデル定義
- `axios`: HTTPリクエスト
- `simple-git`: Git操作

## 注意事項

- GitHubのAPIレート制限に注意してください
- 大規模なリポジトリの処理は時間がかかる場合があります
- APIキーなどの秘密情報は環境変数で管理してください

## Changelog

- 2025/3/21: 初回作成
