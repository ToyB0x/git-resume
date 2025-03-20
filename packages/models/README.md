# Models Package

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

このパッケージは、git-resumeプロジェクトで使用される共通データモデルを提供します。各アプリケーション（API、CLI、Web）で一貫したデータ構造を維持するために使用されます。

## 主要モデル

### User

GitHubユーザー情報を表すモデルです。

```typescript
type User = {
  id: number;
  userName: string;
  displayName: string | null;
  blog: string | null;
  avatarUrl: string;
};
```

### Repository

GitHubリポジトリ情報を表すモデルです。ユーザーが所有または貢献したリポジトリの詳細情報を保持します。

### Resume

ユーザーのレジュメデータを表すモデルです。GitHubの活動履歴から生成されたプロフェッショナルなレジュメ情報が含まれます。

### Pack

リポジトリのパッケージング情報を表すモデルです。リポジトリのコードを解析・パッケージ化した際のメタデータを保持します。

### Summary

リポジトリや活動のサマリー情報を表すモデルです。ユーザーの技術スキルや貢献度を分析した結果が含まれます。

### Events

システム内で発生するイベントを表すモデルです。アクション実行や状態変更などの際に使用されます。

## 使用方法

```typescript
import { User, Repository, Resume } from "@resume/models";

// ユーザーモデルの使用例
const user: User = {
  id: 12345,
  userName: "example-user",
  displayName: "Example User",
  blog: "https://example.com",
  avatarUrl: "https://github.com/example-user.png",
};

// 他のモデルも同様に使用できます
```

## 依存関係

このパッケージは純粋なTypeScriptタイプ定義を提供するもので、外部パッケージへの依存はありません。

## 注意事項

- モデルを変更する際は、各アプリケーションへの影響を必ず確認してください
- 破壊的変更を行う場合は、適切なバージョニングとマイグレーション計画を立ててください

## Changelog

- 2025/3/21: 初回作成
