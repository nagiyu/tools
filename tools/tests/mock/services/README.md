# ToDoDataAccessorMock

テスト用の `ToDoDataAccessor` モック実装です。

## 概要

`ToDoDataAccessorMock` は、DynamoDB や AWS SDK の依存関係なしでテストで使用できる ToDoDataAccessor のインメモリ実装を提供します。

## 機能

- **インメモリストレージ**: すべての操作はインメモリ配列で実行されます
- **完全な CRUD サポート**: 標準的な CRUD 操作（作成、読み取り、更新、削除）をすべて実装
- **カスタムクエリ**: `getByTerminalId()` および `getByDueDate()` フィルタリングをサポート
- **テストユーティリティ**: テストのセットアップと検証のために `setMockData()`、`clearMockData()`、`getMockData()` を提供

## 使用方法

### 基本的な使い方

```typescript
import ToDoDataAccessorMock from '@tools-mock/services/ToDoDataAccessorMock';

describe('My Service Test', () => {
  let mockAccessor: ToDoDataAccessorMock;

  beforeEach(() => {
    mockAccessor = new ToDoDataAccessorMock();
  });

  afterEach(() => {
    mockAccessor.clearMockData();
  });

  it('should create a todo', async () => {
    const todo = await mockAccessor.create({
      TerminalID: 'terminal-123',
      Title: 'Test ToDo',
      DueDate: '2024-10-20',
      Priority: 'Must',
    });

    expect(todo.ID).toBeDefined();
    expect(todo.Title).toBe('Test ToDo');
  });
});
```

### jest.mock() との使用

`jest.mock()` を使用して、実際の `ToDoDataAccessor` をモックに置き換えることができます：

```typescript
import ToDoDataAccessorMock from '@tools-mock/services/ToDoDataAccessorMock';

jest.mock('@tools/services/ToDoDataAccessor', () => {
  return {
    __esModule: true,
    default: ToDoDataAccessorMock,
  };
});

import MyService from '@tools/services/MyService';

describe('MyService', () => {
  it('should work with mocked accessor', async () => {
    const service = new MyService();
    // Service は実際の accessor の代わりに ToDoDataAccessorMock を使用します
    const todos = await service.getTodos('terminal-123');
    expect(todos).toEqual([]);
  });
});
```

### モックデータの設定

モックにテストデータを事前入力できます：

```typescript
const mockData = [
  {
    ID: 'todo-1',
    DataType: 'ToDo',
    TerminalID: 'terminal-123',
    Title: 'Test ToDo',
    DueDate: '2024-10-20',
    Priority: 'Must',
    Create: Date.now(),
    Update: Date.now(),
  },
];

mockAccessor.setMockData(mockData);

const todos = await mockAccessor.get();
expect(todos.length).toBe(1);
```

### モックデータのクリア

テスト間でデータをクリアします：

```typescript
afterEach(() => {
  mockAccessor.clearMockData();
});
```

### 検証用のモックデータ取得

アサーション用に現在のモックデータを取得できます：

```typescript
await mockAccessor.create({ ... });
await mockAccessor.create({ ... });

const currentData = mockAccessor.getMockData();
expect(currentData.length).toBe(2);
```

## API

### 標準メソッド

- `get(): Promise<ToDoRecord[]>` - すべての ToDo レコードを取得
- `getById(id: string): Promise<ToDoRecord | null>` - ID で特定の ToDo を取得
- `create(data: Partial<ToDoRecord>): Promise<ToDoRecord>` - 新しい ToDo を作成
- `update(id: string, updates: Partial<ToDoRecord>): Promise<ToDoRecord | null>` - ToDo を更新
- `delete(id: string): Promise<void>` - ToDo を削除

### カスタムクエリメソッド

- `getByTerminalId(terminalId: string): Promise<ToDoRecord[]>` - 特定のターミナルのすべての ToDo を取得
- `getByDueDate(dueDate: string): Promise<ToDoRecord[]>` - 特定の期日のすべての ToDo を取得

### ユーティリティメソッド

- `setMockData(data: ToDoRecord[]): void` - モックデータを設定
- `clearMockData(): void` - すべてのモックデータをクリア
- `getMockData(): ToDoRecord[]` - 現在のモックデータのコピーを取得
- `getTableName(): string` - テーブル名を取得（常に 'DevTools' を返します）
- `getDataType(): string` - データタイプを取得（常に 'ToDo' を返します）

## 注意事項

- モックは作成されたレコードに対して自動的に一意の ID を生成します
- すべてのタイムスタンプ（Create/Update）は自動的に現在時刻に設定されます
- モックはテスト実行間でデータを永続化しません
- モックは AWS SDK や DynamoDB 接続を必要としません
