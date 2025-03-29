# @resume/utils 使用ガイド

**更新日**: 2025/3/29
**確認日**: 2025/3/29
**自動生成**: このドキュメントはAIによって自動生成されています

## 基本的な使用方法

@resume/utilsパッケージは、プロジェクト全体で使用される汎用的なユーティリティ関数を提供します。以下に使用方法を示します。

### ユーティリティのインポート

必要な関数を直接インポートして使用します：

```typescript
import { sleep } from "@resume/utils";
```

## 提供されるユーティリティ関数

### sleep

非同期処理を指定した時間だけ一時停止するためのユーティリティ関数です：

```typescript
/**
 * 指定したミリ秒間処理を停止します
 * @param ms 停止する時間（ミリ秒）
 * @returns Promise<void>
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
```

#### 使用例

##### 基本的な使用方法

```typescript
import { sleep } from "@resume/utils";

async function example() {
  console.log("処理開始");
  await sleep(1000); // 1秒待機
  console.log("1秒後に実行");
}
```

##### API呼び出しの間隔を空ける

```typescript
import { sleep } from "@resume/utils";

async function fetchWithRateLimit(items) {
  const results = [];
  
  for (const item of items) {
    // API呼び出し
    const result = await fetchData(item);
    results.push(result);
    
    // レート制限を回避するために500ms待機
    await sleep(500);
  }
  
  return results;
}
```

##### 定期的な処理

```typescript
import { sleep } from "@resume/utils";

async function pollUntilComplete(jobId) {
  let isComplete = false;
  
  while (!isComplete) {
    // ジョブのステータスを確認
    const status = await checkJobStatus(jobId);
    
    if (status === "complete") {
      isComplete = true;
    } else {
      // 5秒待機してから再確認
      await sleep(5000);
    }
  }
  
  return await getJobResult(jobId);
}
```

## 注意事項

- `sleep`関数はブラウザとNode.js環境の両方で動作します
- 長時間の待機はメモリリソースを消費するため、非常に長い待機時間（数分以上）には適していません
- 実際のプロダクション環境では、より洗練されたレート制限やポーリングのメカニズムを検討してください