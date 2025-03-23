# サンプル機能ユニットテスト仕様

**更新日**: 2025/3/24
**確認日**: 2025/3/24

## 目的

このドキュメントは、サンプル機能のユニットテストの詳細仕様を定義します。ユニットテストは、個々のコンポーネント（関数、クラス、モジュールなど）が期待通りに動作することを確認するために実施されます。

## テスト対象

ユニットテストは、以下のパッケージの各コンポーネントを対象とします：

1. **api**: APIエンドポイント、コントローラー、ミドルウェア
2. **core**: ビジネスロジック、サービス、ドメインモデル
3. **data**: リポジトリ、データアクセス層
4. **utils**: ユーティリティ関数
5. **ui**: UIコンポーネント、カスタムフック

## テストツール

### バックエンド

- **テストフレームワーク**: Jest
- **モック/スタブ**: Jest組み込み機能
- **アサーションライブラリ**: Jest組み込み
- **カバレッジツール**: Jest組み込み

### フロントエンド

- **テストフレームワーク**: Vitest
- **コンポーネントテスト**: React Testing Library
- **モック/スタブ**: Vitest組み込み機能、MSW
- **アサーションライブラリ**: Vitest組み込み
- **カバレッジツール**: Vitest組み込み

## テスト原則

1. **独立性**: 各テストは他のテストに依存せず、独立して実行できる
2. **再現性**: 同じ条件で何度実行しても同じ結果が得られる
3. **自己完結性**: テストに必要なすべての条件とデータをテスト内で設定する
4. **明確性**: テストの目的と期待結果が明確である
5. **効率性**: テストは高速に実行できる

## テスト構造

### ディレクトリ構造

```
src/
├── api/
│   ├── __tests__/
│   │   ├── controllers.test.ts
│   │   └── middleware.test.ts
│   └── ...
├── core/
│   ├── __tests__/
│   │   ├── services.test.ts
│   │   └── models.test.ts
│   └── ...
└── ...
```

### テストファイル命名規則

- **バックエンド**: `[ファイル名].test.ts`
- **フロントエンド**: `[コンポーネント名].test.tsx`

## テストケース仕様

### 1. APIパッケージ

#### 1.1 コントローラーテスト

**テスト対象**: `api/controllers/sampleEntityController.ts`

##### TC-UNIT-001: エンティティ一覧取得

**目的**: エンティティ一覧を取得するコントローラーが正しく動作することを確認する

**テスト内容**:
- 正常系: サービスから正常にデータを取得し、適切なレスポンスを返す
- 異常系: サービスでエラーが発生した場合、適切なエラーレスポンスを返す

**テストコード例**:
```typescript
describe('SampleEntityController', () => {
  describe('listEntities', () => {
    it('正常にエンティティ一覧を取得して返す', async () => {
      // モックの設定
      const mockEntities = [{ id: '1', name: 'Entity 1' }, { id: '2', name: 'Entity 2' }];
      const mockService = {
        findAll: jest.fn().mockResolvedValue(mockEntities)
      };
      const controller = new SampleEntityController(mockService);
      
      // リクエスト/レスポンスのモック
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      
      // 実行
      await controller.listEntities(req, res);
      
      // 検証
      expect(mockService.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockEntities
      });
    });
    
    it('サービスでエラーが発生した場合、エラーレスポンスを返す', async () => {
      // モックの設定
      const mockError = new Error('Database error');
      const mockService = {
        findAll: jest.fn().mockRejectedValue(mockError)
      };
      const controller = new SampleEntityController(mockService);
      
      // リクエスト/レスポンスのモック
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      
      // 実行
      await controller.listEntities(req, res);
      
      // 検証
      expect(mockService.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error'
      });
    });
  });
});
```

#### 1.2 ミドルウェアテスト

**テスト対象**: `api/middleware/authMiddleware.ts`

##### TC-UNIT-002: 認証ミドルウェア

**目的**: 認証ミドルウェアが正しく動作することを確認する

**テスト内容**:
- 正常系: 有効なトークンで認証が成功する
- 異常系: トークンがない場合、認証エラーを返す
- 異常系: 無効なトークンの場合、認証エラーを返す

**テストコード例**:
```typescript
describe('AuthMiddleware', () => {
  describe('authenticate', () => {
    it('有効なトークンで認証が成功する', () => {
      // モックの設定
      const mockUser = { id: '1', username: 'testuser' };
      const mockToken = 'valid-token';
      const mockTokenService = {
        verifyToken: jest.fn().mockReturnValue(mockUser)
      };
      const middleware = new AuthMiddleware(mockTokenService);
      
      // リクエスト/レスポンス/ネクストのモック
      const req = {
        headers: {
          authorization: `Bearer ${mockToken}`
        }
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn();
      
      // 実行
      middleware.authenticate(req, res, next);
      
      // 検証
      expect(mockTokenService.verifyToken).toHaveBeenCalledWith(mockToken);
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });
    
    it('トークンがない場合、認証エラーを返す', () => {
      // モックの設定
      const mockTokenService = {
        verifyToken: jest.fn()
      };
      const middleware = new AuthMiddleware(mockTokenService);
      
      // リクエスト/レスポンス/ネクストのモック
      const req = {
        headers: {}
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();
      
      // 実行
      middleware.authenticate(req, res, next);
      
      // 検証
      expect(mockTokenService.verifyToken).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Authentication required'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
```

### 2. Coreパッケージ

#### 2.1 サービステスト

**テスト対象**: `core/services/sampleEntityService.ts`

##### TC-UNIT-003: エンティティサービス

**目的**: エンティティサービスの各メソッドが正しく動作することを確認する

**テスト内容**:
- 正常系: エンティティの作成が成功する
- 正常系: エンティティの取得が成功する
- 異常系: 存在しないエンティティの取得でエラーが発生する

**テストコード例**:
```typescript
describe('SampleEntityService', () => {
  describe('createEntity', () => {
    it('エンティティの作成が成功する', async () => {
      // モックの設定
      const entityData = { name: 'Test Entity', status: 'active' };
      const createdEntity = { id: '1', ...entityData, createdAt: new Date(), updatedAt: new Date() };
      const mockRepository = {
        create: jest.fn().mockResolvedValue(createdEntity)
      };
      const service = new SampleEntityService(mockRepository);
      
      // 実行
      const result = await service.createEntity(entityData);
      
      // 検証
      expect(mockRepository.create).toHaveBeenCalledWith(entityData);
      expect(result).toEqual(createdEntity);
    });
  });
  
  describe('findEntityById', () => {
    it('エンティティの取得が成功する', async () => {
      // モックの設定
      const entityId = '1';
      const entity = { id: entityId, name: 'Test Entity', status: 'active' };
      const mockRepository = {
        findById: jest.fn().mockResolvedValue(entity)
      };
      const service = new SampleEntityService(mockRepository);
      
      // 実行
      const result = await service.findEntityById(entityId);
      
      // 検証
      expect(mockRepository.findById).toHaveBeenCalledWith(entityId);
      expect(result).toEqual(entity);
    });
    
    it('存在しないエンティティの取得でエラーが発生する', async () => {
      // モックの設定
      const entityId = 'non-existent';
      const mockRepository = {
        findById: jest.fn().mockResolvedValue(null)
      };
      const service = new SampleEntityService(mockRepository);
      
      // 実行と検証
      await expect(service.findEntityById(entityId)).rejects.toThrow('Entity not found');
      expect(mockRepository.findById).toHaveBeenCalledWith(entityId);
    });
  });
});
```

#### 2.2 ドメインモデルテスト

**テスト対象**: `core/models/sampleEntity.ts`

##### TC-UNIT-004: エンティティモデル

**目的**: エンティティモデルのメソッドとバリデーションが正しく動作することを確認する

**テスト内容**:
- 正常系: 有効なデータでエンティティが作成できる
- 異常系: 無効なデータでエンティティ作成時にエラーが発生する
- 正常系: エンティティのステータス変更が正しく動作する

**テストコード例**:
```typescript
describe('SampleEntity', () => {
  describe('constructor', () => {
    it('有効なデータでエンティティが作成できる', () => {
      // 実行
      const entity = new SampleEntity({
        name: 'Test Entity',
        description: 'This is a test entity',
        status: 'active'
      });
      
      // 検証
      expect(entity.name).toBe('Test Entity');
      expect(entity.description).toBe('This is a test entity');
      expect(entity.status).toBe('active');
      expect(entity.isActive()).toBe(true);
    });
    
    it('無効なデータでエンティティ作成時にエラーが発生する', () => {
      // 実行と検証
      expect(() => new SampleEntity({
        name: '', // 空の名前は無効
        description: 'This is a test entity',
        status: 'active'
      })).toThrow('Name is required');
    });
  });
  
  describe('changeStatus', () => {
    it('エンティティのステータス変更が正しく動作する', () => {
      // 準備
      const entity = new SampleEntity({
        name: 'Test Entity',
        status: 'active'
      });
      
      // 実行
      entity.changeStatus('inactive');
      
      // 検証
      expect(entity.status).toBe('inactive');
      expect(entity.isActive()).toBe(false);
    });
    
    it('無効なステータスへの変更でエラーが発生する', () => {
      // 準備
      const entity = new SampleEntity({
        name: 'Test Entity',
        status: 'active'
      });
      
      // 実行と検証
      expect(() => entity.changeStatus('invalid-status')).toThrow('Invalid status');
    });
  });
});
```

### 3. UIパッケージ

#### 3.1 コンポーネントテスト

**テスト対象**: `ui/components/EntityForm.tsx`

##### TC-UNIT-005: エンティティフォームコンポーネント

**目的**: エンティティフォームコンポーネントが正しく動作することを確認する

**テスト内容**:
- 正常系: フォームが正しくレンダリングされる
- 正常系: 入力値の変更が正しく処理される
- 正常系: フォーム送信が正しく処理される
- 異常系: バリデーションエラーが正しく表示される

**テストコード例**:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EntityForm } from '../components/EntityForm';

describe('EntityForm', () => {
  const mockSubmit = jest.fn();
  
  beforeEach(() => {
    mockSubmit.mockClear();
  });
  
  it('フォームが正しくレンダリングされる', () => {
    // レンダリング
    render(<EntityForm onSubmit={mockSubmit} />);
    
    // 検証
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
  
  it('入力値の変更が正しく処理される', async () => {
    // レンダリング
    render(<EntityForm onSubmit={mockSubmit} />);
    
    // 入力
    await userEvent.type(screen.getByLabelText(/name/i), 'Test Entity');
    await userEvent.type(screen.getByLabelText(/description/i), 'This is a test entity');
    await userEvent.selectOptions(screen.getByLabelText(/status/i), 'active');
    
    // 検証
    expect(screen.getByLabelText(/name/i)).toHaveValue('Test Entity');
    expect(screen.getByLabelText(/description/i)).toHaveValue('This is a test entity');
    expect(screen.getByLabelText(/status/i)).toHaveValue('active');
  });
  
  it('フォーム送信が正しく処理される', async () => {
    // レンダリング
    render(<EntityForm onSubmit={mockSubmit} />);
    
    // 入力
    await userEvent.type(screen.getByLabelText(/name/i), 'Test Entity');
    await userEvent.type(screen.getByLabelText(/description/i), 'This is a test entity');
    await userEvent.selectOptions(screen.getByLabelText(/status/i), 'active');
    
    // 送信
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // 検証
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Test Entity',
      description: 'This is a test entity',
      status: 'active'
    });
  });
  
  it('バリデーションエラーが正しく表示される', async () => {
    // レンダリング
    render(<EntityForm onSubmit={mockSubmit} />);
    
    // 空のフォームを送信
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // 検証
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
```

#### 3.2 カスタムフックテスト

**テスト対象**: `ui/hooks/useEntityData.ts`

##### TC-UNIT-006: エンティティデータフック

**目的**: エンティティデータを取得するカスタムフックが正しく動作することを確認する

**テスト内容**:
- 正常系: データ取得が成功する
- 異常系: データ取得でエラーが発生する
- 正常系: データ更新が成功する

**テストコード例**:
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useEntityData } from '../hooks/useEntityData';
import * as api from '../api/entityApi';

// APIモック
jest.mock('../api/entityApi');

describe('useEntityData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('データ取得が成功する', async () => {
    // モックの設定
    const mockEntities = [{ id: '1', name: 'Entity 1' }, { id: '2', name: 'Entity 2' }];
    (api.fetchEntities as jest.Mock).mockResolvedValue(mockEntities);
    
    // フックのレンダリング
    const { result, waitForNextUpdate } = renderHook(() => useEntityData());
    
    // 初期状態の検証
    expect(result.current.loading).toBe(true);
    expect(result.current.entities).toEqual([]);
    expect(result.current.error).toBeNull();
    
    // 非同期処理の完了を待つ
    await waitForNextUpdate();
    
    // 完了後の状態の検証
    expect(result.current.loading).toBe(false);
    expect(result.current.entities).toEqual(mockEntities);
    expect(result.current.error).toBeNull();
    expect(api.fetchEntities).toHaveBeenCalledTimes(1);
  });
  
  it('データ取得でエラーが発生する', async () => {
    // モックの設定
    const mockError = new Error('Failed to fetch entities');
    (api.fetchEntities as jest.Mock).mockRejectedValue(mockError);
    
    // フックのレンダリング
    const { result, waitForNextUpdate } = renderHook(() => useEntityData());
    
    // 非同期処理の完了を待つ
    await waitForNextUpdate();
    
    // 完了後の状態の検証
    expect(result.current.loading).toBe(false);
    expect(result.current.entities).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch entities');
    expect(api.fetchEntities).toHaveBeenCalledTimes(1);
  });
  
  it('データ更新が成功する', async () => {
    // モックの設定
    const mockEntities = [{ id: '1', name: 'Entity 1' }];
    const newEntity = { id: '2', name: 'Entity 2' };
    (api.fetchEntities as jest.Mock).mockResolvedValue(mockEntities);
    (api.createEntity as jest.Mock).mockResolvedValue(newEntity);
    
    // フックのレンダリング
    const { result, waitForNextUpdate } = renderHook(() => useEntityData());
    
    // 非同期処理の完了を待つ
    await waitForNextUpdate();
    
    // 更新アクションの実行
    act(() => {
      result.current.addEntity({ name: 'Entity 2' });
    });
    
    // 更新中の状態の検証
    expect(result.current.loading).toBe(true);
    
    // 非同期処理の完了を待つ
    await waitForNextUpdate();
    
    // 完了後の状態の検証
    expect(result.current.loading).toBe(false);
    expect(result.current.entities).toEqual([...mockEntities, newEntity]);
    expect(result.current.error).toBeNull();
    expect(api.createEntity).toHaveBeenCalledWith({ name: 'Entity 2' });
  });
});
```

## テスト実行計画

### 実行環境

- **ローカル開発環境**: 開発者のマシン上
- **CI環境**: GitHub Actions

### 実行タイミング

- **開発中**: 開発者が随時実行
- **コミット前**: pre-commitフックで実行
- **プルリクエスト時**: CI/CDパイプラインで自動実行

### 実行コマンド

- **バックエンド**:
  ```bash
  # すべてのテストを実行
  npm run test
  
  # 特定のディレクトリのテストを実行
  npm run test -- --testPathPattern=src/api
  
  # カバレッジレポートを生成
  npm run test -- --coverage
  ```

- **フロントエンド**:
  ```bash
  # すべてのテストを実行
  npm run test
  
  # 特定のコンポーネントのテストを実行
  npm run test -- EntityForm
  
  # カバレッジレポートを生成
  npm run test -- --coverage
  ```

## カバレッジ目標

| パッケージ | ステートメントカバレッジ | 分岐カバレッジ | 関数カバレッジ |
|-----------|------------------------|--------------|--------------|
| api | 80% | 70% | 90% |
| core | 90% | 80% | 95% |
| data | 80% | 70% | 90% |
| utils | 90% | 80% | 95% |
| ui | 80% | 70% | 90% |

## テスト結果の評価

### 成功基準

- すべてのテストが成功する
- カバレッジ目標を達成する
- コードスタイルとベストプラクティスに準拠している

### 失敗時の対応

1. テスト失敗の原因を特定する
2. 修正を行い、テストを再実行する
3. 必要に応じてテストケース自体を見直す

## メタデータ

**更新・確認情報**:
- 最終更新日: 2025/03/24
- 最終確認日: 2025/03/24

**文書情報**:
- ステータス: ドラフト
- バージョン: 0.1.0

## 関連ドキュメント

- [テスト戦略概要](./README.md)
- [E2Eテスト仕様](./e2e-tests.md)
- [システム全体設計](../overview-specs/system.md)

## Changelog

- 2025/3/24: 初回ドラフト作成