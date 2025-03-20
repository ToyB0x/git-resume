# Utils Package

**更新日**: 2025/3/21
**確認日**: 2025/3/21

## 概要

このパッケージは、git-resumeプロジェクト全体で使用される共通ユーティリティ関数を提供します。複数のアプリケーションやパッケージで再利用可能な汎用的な機能が含まれています。

## 主要ユーティリティ

### sleep

非同期処理を指定した時間だけ一時停止するためのユーティリティ関数です。

```typescript
/**
 * 指定したミリ秒間処理を停止します
 * @param ms 停止する時間（ミリ秒）
 * @returns Promise<void>
 */
function sleep(ms: number): Promise<void>
```

使用例:
```typescript
import { sleep } from "@resume/utils";

// API呼び出しの間に1秒の遅延を挿入
async function fetchWithDelay() {
  await fetchFirstResource();
  await sleep(1000); // 1秒待機
  await fetchSecondResource();
}
```

## その他のユーティリティ

このパッケージには、以下のような汎用的なユーティリティ関数が含まれています：

- ファイル操作ヘルパー
- 文字列処理関数
- 日付操作ユーティリティ
- エラーハンドリングヘルパー
- ロギングユーティリティ

## 使用方法

```typescript
import { sleep } from "@resume/utils";

// 使用例
async function rateLimitedApiCalls() {
  for (const item of items) {
    await processItem(item);
    await sleep(500); // API呼び出しの間に500ms待機
  }
}
```

## 開発ガイドライン

新しいユーティリティ関数を追加する際は、以下のガイドラインに従ってください：

1. 関数は単一責任の原則に従うこと
2. 適切なテストを作成すること
3. TypeScriptの型を適切に定義すること
4. ドキュメントコメントを追加すること

## 依存関係

このパッケージは外部依存関係を最小限に抑えるように設計されています。基本的な JavaScript/TypeScript 機能のみを使用し、必要な場合のみ外部パッケージを依存関係に追加します。

## Changelog

- 2025/3/21: 初回作成
