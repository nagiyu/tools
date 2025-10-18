# ToDoDataAccessorMock

Mock implementation of `ToDoDataAccessor` for testing purposes.

## Overview

`ToDoDataAccessorMock` provides an in-memory implementation of the ToDoDataAccessor that can be used in tests without requiring DynamoDB or AWS SDK dependencies.

## Features

- **In-memory storage**: All operations are performed on an in-memory array
- **Full CRUD support**: Implements all standard CRUD operations (create, read, update, delete)
- **Custom queries**: Supports `getByTerminalId()` and `getByDueDate()` filtering
- **Test utilities**: Provides `setMockData()`, `clearMockData()`, and `getMockData()` for test setup and verification

## Usage

### Basic Usage

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

### Using with jest.mock()

You can use `jest.mock()` to replace the real `ToDoDataAccessor` with the mock:

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
    // Service will use ToDoDataAccessorMock instead of real accessor
    const todos = await service.getTodos('terminal-123');
    expect(todos).toEqual([]);
  });
});
```

### Setting Mock Data

You can pre-populate the mock with test data:

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

### Clearing Mock Data

Clear all data between tests:

```typescript
afterEach(() => {
  mockAccessor.clearMockData();
});
```

### Getting Mock Data for Verification

You can retrieve the current mock data for assertions:

```typescript
await mockAccessor.create({ ... });
await mockAccessor.create({ ... });

const currentData = mockAccessor.getMockData();
expect(currentData.length).toBe(2);
```

## API

### Standard Methods

- `get(): Promise<ToDoRecord[]>` - Get all ToDo records
- `getById(id: string): Promise<ToDoRecord | null>` - Get a specific ToDo by ID
- `create(data: Partial<ToDoRecord>): Promise<ToDoRecord>` - Create a new ToDo
- `update(id: string, updates: Partial<ToDoRecord>): Promise<ToDoRecord | null>` - Update a ToDo
- `delete(id: string): Promise<void>` - Delete a ToDo

### Custom Query Methods

- `getByTerminalId(terminalId: string): Promise<ToDoRecord[]>` - Get all ToDos for a specific terminal
- `getByDueDate(dueDate: string): Promise<ToDoRecord[]>` - Get all ToDos with a specific due date

### Utility Methods

- `setMockData(data: ToDoRecord[]): void` - Set the mock data
- `clearMockData(): void` - Clear all mock data
- `getMockData(): ToDoRecord[]` - Get a copy of the current mock data
- `getTableName(): string` - Get the table name (always returns 'DevTools')
- `getDataType(): string` - Get the data type (always returns 'ToDo')

## Notes

- The mock automatically generates unique IDs for created records
- All timestamps (Create/Update) are automatically set to the current time
- The mock does not persist data between test runs
- The mock does not require AWS SDK or DynamoDB connection
