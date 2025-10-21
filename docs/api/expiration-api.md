# Expiration Manager API Documentation

このドキュメントは、賞味期限管理機能のAPI仕様を説明します。

## 認証・識別

すべてのエンドポイントは、TerminalIDをクエリパラメータまたはリクエストボディに含める必要があります。

- **GET, DELETE**: クエリパラメータ `terminalId`
- **POST, PUT**: リクエストボディに `terminalId`

TerminalIDは、クライアント側で `IdentifierUtil.client.ts` を使用して取得できます。

## エンドポイント

### 1. GET /api/expiration

TerminalIDに紐づく賞味期限データの一覧を取得します。

**リクエスト例:**
```http
GET /api/expiration?terminalId=terminal-123 HTTP/1.1
```

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| terminalId | string | ✓ | TerminalID |

**レスポンス例:**
```json
{
  "expirations": [
    {
      "id": "uuid-1234",
      "terminalId": "terminal-123",
      "title": "牛乳",
      "expirationDate": "2024-10-20",
      "memo": "開封済み",
      "create": 1697000000,
      "update": 1697000000
    }
  ]
}
```

**エラー:**
- `400 Bad Request`: terminalIdが指定されていない場合
- `500 Internal Server Error`: サーバーエラー

---

### 2. POST /api/expiration

新しい賞味期限データを作成します。

**リクエスト例:**
```http
POST /api/expiration HTTP/1.1
Content-Type: application/json

{
  "terminalId": "terminal-123",
  "title": "牛乳",
  "expirationDate": "2024-10-20",
  "memo": "開封済み"
}
```

**リクエストパラメータ:**
| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| terminalId | string | ✓ | TerminalID |
| title | string | ✓ | 商品タイトル |
| expirationDate | string | ✓ | 賞味期限 (YYYY-MM-DD) |
| memo | string | - | メモ（オプション） |

**レスポンス例:**
```json
{
  "expiration": {
    "id": "uuid-5678",
    "terminalId": "terminal-123",
    "title": "牛乳",
    "expirationDate": "2024-10-20",
    "memo": "開封済み",
    "create": 1697000100,
    "update": 1697000100
  }
}
```

**エラー:**
- `400 Bad Request`: 必須フィールドが不足している場合
- `500 Internal Server Error`: サーバーエラー

---

### 3. PUT /api/expiration

既存の賞味期限データを更新します。

**リクエスト例:**
```http
PUT /api/expiration HTTP/1.1
Content-Type: application/json

{
  "terminalId": "terminal-123",
  "id": "uuid-1234",
  "title": "牛乳（低脂肪）",
  "expirationDate": "2024-10-21",
  "memo": "まだ新しい"
}
```

**リクエストパラメータ:**
| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| terminalId | string | ✓ | TerminalID |
| id | string | ✓ | 更新対象のID |
| title | string | - | 商品タイトル |
| expirationDate | string | - | 賞味期限 (YYYY-MM-DD) |
| memo | string | - | メモ |

**レスポンス例:**
```json
{
  "expiration": {
    "id": "uuid-1234",
    "terminalId": "terminal-123",
    "title": "牛乳（低脂肪）",
    "expirationDate": "2024-10-21",
    "memo": "まだ新しい",
    "create": 1697000000,
    "update": 1697000200
  }
}
```

**エラー:**
- `400 Bad Request`: 必須フィールドが指定されていない場合
- `404 Not Found`: 指定されたIDのデータが存在しない、または別のTerminalIDのデータの場合
- `500 Internal Server Error`: サーバーエラー

---

### 4. DELETE /api/expiration

賞味期限データを削除します。

**リクエスト例:**
```http
DELETE /api/expiration?terminalId=terminal-123&id=uuid-1234 HTTP/1.1
```

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| terminalId | string | ✓ | TerminalID |
| id | string | ✓ | 削除対象のID |

**レスポンス例:**
```json
{
  "success": true
}
```

**エラー:**
- `400 Bad Request`: 必須パラメータが指定されていない場合
- `404 Not Found`: 指定されたIDのデータが存在しない、または別のTerminalIDのデータの場合
- `500 Internal Server Error`: サーバーエラー

---

### 5. GET /api/expiration/settings

TerminalIDに紐づく通知設定を取得します。設定が存在しない場合は、デフォルト値を返します。

**リクエスト例:**
```http
GET /api/expiration/settings?terminalId=terminal-123 HTTP/1.1
```

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| terminalId | string | ✓ | TerminalID |

**レスポンス例:**
```json
{
  "settings": {
    "id": "settings-uuid",
    "terminalId": "terminal-123",
    "notificationHour": 9,
    "daysBeforeNotify": 3,
    "create": 1697000000,
    "update": 1697000000
  }
}
```

**デフォルト値:**
- `notificationHour`: 9 (午前9時)
- `daysBeforeNotify`: 3 (3日前)

**エラー:**
- `400 Bad Request`: terminalIdが指定されていない場合
- `500 Internal Server Error`: サーバーエラー

---

### 6. PUT /api/expiration/settings

通知設定を更新または作成します。

**リクエスト例:**
```http
PUT /api/expiration/settings HTTP/1.1
Content-Type: application/json

{
  "terminalId": "terminal-123",
  "notificationHour": 10,
  "daysBeforeNotify": 5
}
```

**リクエストパラメータ:**
| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| terminalId | string | ✓ | TerminalID |
| notificationHour | number | - | 通知時間 (0-23) |
| daysBeforeNotify | number | - | 何日前から通知するか (0以上) |

**レスポンス例:**
```json
{
  "settings": {
    "id": "settings-uuid",
    "terminalId": "terminal-123",
    "notificationHour": 10,
    "daysBeforeNotify": 5,
    "create": 1697000000,
    "update": 1697000300
  }
}
```

**エラー:**
- `400 Bad Request`: 
  - terminalIdが指定されていない場合
  - notificationHourが0-23の範囲外の場合
  - daysBeforeNotifyが負の値の場合
- `500 Internal Server Error`: サーバーエラー

---

### 7. DELETE /api/expiration/settings

通知設定を削除します。設定を削除すると、次回取得時はデフォルト値が返されます。

**リクエスト例:**
```http
DELETE /api/expiration/settings?terminalId=terminal-123 HTTP/1.1
```

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| terminalId | string | ✓ | TerminalID |

**レスポンス例:**
```json
{
  "success": true
}
```

**エラー:**
- `400 Bad Request`: terminalIdが指定されていない場合
- `404 Not Found`: 設定が存在しない場合
- `500 Internal Server Error`: サーバーエラー

---

## 使用例 (クライアント側)

### 賞味期限データの取得

```typescript
import IdentifierUtil from '@client-common/utils/IdentifierUtil.client';

const terminalId = await IdentifierUtil.getTerminalId();

const response = await fetch(`/api/expiration?terminalId=${terminalId}`, {
  method: 'GET',
});

const data = await response.json();
console.log(data.expirations);
```

### 新しいデータの作成

```typescript
const terminalId = await IdentifierUtil.getTerminalId();

const response = await fetch('/api/expiration', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    terminalId,
    title: '牛乳',
    expirationDate: '2024-10-20',
    memo: '開封済み',
  }),
});

const data = await response.json();
console.log(data.expiration);
```

### データの更新

```typescript
const terminalId = await IdentifierUtil.getTerminalId();

const response = await fetch('/api/expiration', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    terminalId,
    id: 'uuid-1234',
    title: '牛乳（低脂肪）',
    memo: 'まだ新しい',
  }),
});

const data = await response.json();
console.log(data.expiration);
```

### データの削除

```typescript
const terminalId = await IdentifierUtil.getTerminalId();

const response = await fetch(`/api/expiration?terminalId=${terminalId}&id=uuid-1234`, {
  method: 'DELETE',
});

const data = await response.json();
console.log(data.success);
```

### 設定の取得

```typescript
const terminalId = await IdentifierUtil.getTerminalId();

const response = await fetch(`/api/expiration/settings?terminalId=${terminalId}`, {
  method: 'GET',
});

const data = await response.json();
console.log(data.settings);
```

### 設定の更新

```typescript
const terminalId = await IdentifierUtil.getTerminalId();

const response = await fetch('/api/expiration/settings', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    terminalId,
    notificationHour: 10,
    daysBeforeNotify: 5,
  }),
});

const data = await response.json();
console.log(data.settings);
```

### 設定の削除

```typescript
const terminalId = await IdentifierUtil.getTerminalId();

const response = await fetch(`/api/expiration/settings?terminalId=${terminalId}`, {
  method: 'DELETE',
});

const data = await response.json();
console.log(data.success);
```

---

## セキュリティ注意事項

1. **TerminalID検証**: すべてのAPIは、TerminalIDによるデータ分離を行います。
2. **オーナーシップ検証**: 更新・削除操作時に、データが要求元のTerminalIDに属しているか確認します。
3. **入力検証**: 各エンドポイントで適切な入力検証を行います。

---

## エラーハンドリング

すべてのエラーは統一されたフォーマットで返されます：

```json
{
  "error": "エラーメッセージ"
}
```

HTTPステータスコード：
- `200 OK`: 成功
- `400 Bad Request`: クライアントエラー（不正なリクエスト）
- `404 Not Found`: リソースが見つからない
- `500 Internal Server Error`: サーバーエラー
