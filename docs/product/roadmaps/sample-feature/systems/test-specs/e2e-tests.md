# サンプル機能 E2Eテスト仕様

**更新日**: 2025/3/24
**確認日**: 2025/3/24

## 目的

このドキュメントは、サンプル機能のエンドツーエンド（E2E）テストの詳細仕様を定義します。E2Eテストは、実際のユーザーの視点からシステム全体の動作を検証し、各コンポーネントが連携して正しく機能することを確認するために実施されます。

## テスト環境

### テスト環境構成

- **ブラウザ**: Chrome, Firefox, Safari, Edge最新版
- **デバイス**: デスクトップ、タブレット、モバイル
- **環境**: ステージング環境
- **テストデータ**: テスト専用データセット

### 前提条件

- テスト用ユーザーアカウントが作成済み
- テスト用データが初期化済み
- すべての依存サービスが稼働中
- テスト環境がデプロイ済み

## テストツール

- **テストフレームワーク**: Playwright
- **アサーションライブラリ**: Playwright組み込み
- **レポート生成**: Playwright HTML Reporter
- **CI統合**: GitHub Actions

## テストケース

### 1. ユーザー認証フロー

#### TC-E2E-001: ユーザーログイン

**目的**: 有効な認証情報でユーザーがログインできることを確認する

**前提条件**:
- 有効なユーザーアカウントが存在する

**手順**:
1. ログインページにアクセスする
2. 有効なユーザー名とパスワードを入力する
3. ログインボタンをクリックする

**期待結果**:
- ユーザーがダッシュボードページにリダイレクトされる
- ユーザー名がヘッダーに表示される
- ログイン成功のメッセージが表示される

**自動化コード例**:
```typescript
test('ユーザーが有効な認証情報でログインできる', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="username"]', 'testuser');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');
  
  // リダイレクトの確認
  await expect(page).toHaveURL('/dashboard');
  
  // ユーザー名の表示確認
  const userNameElement = page.locator('[data-testid="user-name"]');
  await expect(userNameElement).toBeVisible();
  await expect(userNameElement).toHaveText('testuser');
  
  // 成功メッセージの確認
  const successMessage = page.locator('[data-testid="success-message"]');
  await expect(successMessage).toBeVisible();
  await expect(successMessage).toHaveText('ログインに成功しました');
});
```

#### TC-E2E-002: 無効な認証情報でのログイン試行

**目的**: 無効な認証情報でログインを試みた場合、適切なエラーメッセージが表示されることを確認する

**前提条件**:
- なし

**手順**:
1. ログインページにアクセスする
2. 無効なユーザー名とパスワードを入力する
3. ログインボタンをクリックする

**期待結果**:
- ユーザーはログインページに留まる
- エラーメッセージが表示される
- 入力フィールドが適切にハイライトされる

**自動化コード例**:
```typescript
test('無効な認証情報でログインを試みるとエラーが表示される', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="username"]', 'invaliduser');
  await page.fill('[data-testid="password"]', 'invalidpassword');
  await page.click('[data-testid="login-button"]');
  
  // ページ遷移がないことを確認
  await expect(page).toHaveURL('/login');
  
  // エラーメッセージの確認
  const errorMessage = page.locator('[data-testid="error-message"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText('ユーザー名またはパスワードが正しくありません');
  
  // 入力フィールドのエラー状態確認
  const usernameField = page.locator('[data-testid="username"]');
  const passwordField = page.locator('[data-testid="password"]');
  await expect(usernameField).toHaveClass(/error/);
  await expect(passwordField).toHaveClass(/error/);
});
```

### 2. サンプル機能のコア機能

#### TC-E2E-003: 新規エンティティの作成

**目的**: ユーザーが新しいエンティティを正常に作成できることを確認する

**前提条件**:
- ユーザーがログイン済み
- エンティティ作成権限を持っている

**手順**:
1. ダッシュボードページにアクセスする
2. 「新規作成」ボタンをクリックする
3. 必要な情報を入力する
4. 「保存」ボタンをクリックする

**期待結果**:
- 新しいエンティティが作成される
- 成功メッセージが表示される
- エンティティ一覧に新しいエンティティが表示される

**自動化コード例**:
```typescript
test('ユーザーが新規エンティティを作成できる', async ({ page }) => {
  // ログイン
  await loginUser(page, 'testuser', 'password123');
  
  // ダッシュボードにアクセス
  await page.goto('/dashboard');
  
  // 新規作成ボタンをクリック
  await page.click('[data-testid="create-new-button"]');
  
  // フォーム入力
  await page.fill('[data-testid="entity-name"]', 'テストエンティティ');
  await page.fill('[data-testid="entity-description"]', 'これはテスト用のエンティティです');
  await page.selectOption('[data-testid="entity-status"]', 'active');
  
  // 保存
  await page.click('[data-testid="save-button"]');
  
  // 成功メッセージの確認
  const successMessage = page.locator('[data-testid="success-message"]');
  await expect(successMessage).toBeVisible();
  await expect(successMessage).toHaveText('エンティティが正常に作成されました');
  
  // エンティティ一覧に表示されることを確認
  await page.goto('/entities');
  const entityRow = page.locator('tr', { hasText: 'テストエンティティ' });
  await expect(entityRow).toBeVisible();
});
```

#### TC-E2E-004: エンティティの検索とフィルタリング

**目的**: ユーザーがエンティティを検索およびフィルタリングできることを確認する

**前提条件**:
- ユーザーがログイン済み
- 複数のエンティティが存在する

**手順**:
1. エンティティ一覧ページにアクセスする
2. 検索ボックスに検索語を入力する
3. フィルターオプションを選択する
4. 「検索」ボタンをクリックする

**期待結果**:
- 検索条件に一致するエンティティのみが表示される
- 一致するエンティティがない場合は適切なメッセージが表示される

**自動化コード例**:
```typescript
test('ユーザーがエンティティを検索およびフィルタリングできる', async ({ page }) => {
  // ログイン
  await loginUser(page, 'testuser', 'password123');
  
  // エンティティ一覧にアクセス
  await page.goto('/entities');
  
  // 検索とフィルタリング
  await page.fill('[data-testid="search-input"]', 'テスト');
  await page.selectOption('[data-testid="status-filter"]', 'active');
  await page.click('[data-testid="search-button"]');
  
  // 検索結果の確認
  const entityRows = page.locator('tr').filter({ hasText: 'テスト' });
  await expect(entityRows).toHaveCount(2); // 2件のエンティティが見つかると仮定
  
  // すべての結果が「active」ステータスであることを確認
  const statusCells = page.locator('[data-testid="status-cell"]');
  await expect(statusCells).toHaveCount(2);
  await expect(statusCells.nth(0)).toHaveText('active');
  await expect(statusCells.nth(1)).toHaveText('active');
});
```

### 3. エンドツーエンドのビジネスフロー

#### TC-E2E-005: エンティティの作成から削除までの完全なライフサイクル

**目的**: エンティティの完全なライフサイクル（作成、表示、編集、削除）が正常に機能することを確認する

**前提条件**:
- ユーザーがログイン済み
- 必要な権限を持っている

**手順**:
1. 新しいエンティティを作成する
2. 作成したエンティティの詳細を表示する
3. エンティティの情報を編集する
4. 編集した情報が保存されていることを確認する
5. エンティティを削除する
6. エンティティが一覧から削除されていることを確認する

**期待結果**:
- すべての操作が正常に完了する
- 各ステップで適切なフィードバックが表示される
- 最終的にエンティティが削除される

**自動化コード例**:
```typescript
test('エンティティの完全なライフサイクルが正常に機能する', async ({ page }) => {
  // ログイン
  await loginUser(page, 'testuser', 'password123');
  
  // 1. エンティティ作成
  await page.goto('/dashboard');
  await page.click('[data-testid="create-new-button"]');
  await page.fill('[data-testid="entity-name"]', 'ライフサイクルテスト');
  await page.fill('[data-testid="entity-description"]', 'ライフサイクルテスト用のエンティティ');
  await page.selectOption('[data-testid="entity-status"]', 'active');
  await page.click('[data-testid="save-button"]');
  
  // 成功メッセージの確認
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  
  // 2. エンティティ詳細表示
  await page.goto('/entities');
  const entityRow = page.locator('tr', { hasText: 'ライフサイクルテスト' });
  await entityRow.locator('[data-testid="view-button"]').click();
  
  // 詳細ページの確認
  await expect(page).toHaveURL(/\/entities\/\d+/);
  await expect(page.locator('[data-testid="entity-name-display"]')).toHaveText('ライフサイクルテスト');
  
  // 3. エンティティ編集
  await page.click('[data-testid="edit-button"]');
  await page.fill('[data-testid="entity-name"]', 'ライフサイクルテスト（編集済）');
  await page.click('[data-testid="save-button"]');
  
  // 4. 編集結果の確認
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  await expect(page.locator('[data-testid="entity-name-display"]')).toHaveText('ライフサイクルテスト（編集済）');
  
  // 5. エンティティ削除
  await page.click('[data-testid="delete-button"]');
  await page.click('[data-testid="confirm-delete-button"]');
  
  // 6. 削除結果の確認
  await expect(page).toHaveURL('/entities');
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  
  // エンティティが一覧から削除されていることを確認
  const deletedEntityRow = page.locator('tr', { hasText: 'ライフサイクルテスト（編集済）' });
  await expect(deletedEntityRow).toHaveCount(0);
});
```

## テスト実行計画

### 実行環境

- **CI環境**: GitHub Actions
- **定期実行**: 毎日午前3時
- **トリガー実行**: プルリクエスト作成時、マージ時

### 実行順序

1. 認証関連テスト
2. 基本機能テスト
3. 複合フローテスト

### 並列実行

- ブラウザごとに並列実行
- デバイスタイプごとに並列実行

## 障害対応

### 再試行戦略

- 不安定なテストは最大3回再試行
- ネットワーク関連の障害は自動的に再試行

### 障害報告

- テスト失敗時はスクリーンショットとビデオを保存
- 障害情報をSlackチャンネルに通知
- GitHub Issuesに自動的に課題を作成

## メンテナンス計画

### 定期的なレビュー

- 月次でテストケースの有効性をレビュー
- 失敗率の高いテストを特定し改善

### 更新計画

- 新機能追加時にテストケースを追加
- UIの変更に合わせてセレクターを更新

## メタデータ

**更新・確認情報**:
- 最終更新日: 2025/03/24
- 最終確認日: 2025/03/24

**文書情報**:
- ステータス: ドラフト
- バージョン: 0.1.0

## 関連ドキュメント

- [テスト戦略概要](./README.md)
- [ユニットテスト仕様](./unit-tests.md)
- [システム全体設計](../overview-specs/system.md)

## Changelog

- 2025/3/24: 初回ドラフト作成