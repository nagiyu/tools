# Freshness Notifier Client

FreshnessNotifier をクライアントで扱うためのAPIとサービス実装

## 概要

本実装は、FreshnessNotifier サービスをクライアントアプリケーションから利用するためのAPI層とフェッチサービス層を提供します。

### アーキテクチャ

```
client/freshness-notifier/
├── app/api/                        # Next.js API Routes
│   ├── freshness/                  # Freshness CRUD API
│   │   ├── route.ts               # GET(all), POST(create)
│   │   └── [id]/route.ts          # GET, PUT, DELETE (by ID)
│   └── settings/                   # Settings CRUD API
│       ├── route.ts               # GET(all), POST(create)
│       ├── [id]/route.ts          # GET, PUT, DELETE (by ID)
│       └── terminal/[terminalId]/  # GET by terminal ID
│           └── route.ts
└── services/                       # Client-side fetch services
    ├── FreshnessNotifierFetchService.client.ts
    └── SettingFetchService.client.ts
```

## API エンドポイント

### Freshness API

#### GET /api/freshness
全ての Freshness アイテムを取得

**レスポンス:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Milk",
      "expiryDate": "2024-01-15",
      "notificationEnabled": true,
      "create": 1704067200000,
      "update": 1704067200000
    }
  ]
}
```

#### POST /api/freshness
新しい Freshness アイテムを作成

**リクエスト:**
```json
{
  "name": "Milk",
  "expiryDate": "2024-01-15",
  "notificationEnabled": true
}
```

#### GET /api/freshness/{id}
ID による Freshness アイテム取得

#### PUT /api/freshness/{id}
Freshness アイテムの更新

#### DELETE /api/freshness/{id}
Freshness アイテムの削除

### Settings API

#### GET /api/settings
全ての Settings を取得

#### POST /api/settings
新しい Setting を作成

**リクエスト:**
```json
{
  "terminalId": "terminal-123",
  "subscriptionEndpoint": "https://...",
  "subscriptionKeysP256dh": "key...",
  "subscriptionKeysAuth": "auth...",
  "notificationEnabled": true,
  "notificationTime": 9
}
```

#### GET /api/settings/{id}
ID による Setting 取得

#### PUT /api/settings/{id}
Setting の更新

#### DELETE /api/settings/{id}
Setting の削除

#### GET /api/settings/terminal/{terminalId}
Terminal ID による Setting 取得

## フェッチサービス

### FreshnessNotifierFetchService

```typescript
import FreshnessNotifierFetchService from '@freshness-notifier/services/FreshnessNotifierFetchService.client';

const service = new FreshnessNotifierFetchService();

// Get all items
const items = await service.get();

// Get by ID
const item = await service.getById('uuid');

// Create new item
const newItem = await service.create({
  name: 'Milk',
  expiryDate: '2024-01-15',
  notificationEnabled: true
});

// Update item
const updatedItem = await service.update(item);

// Delete item
await service.delete('uuid');
```

### SettingFetchService

```typescript
import SettingFetchService from '@freshness-notifier/services/SettingFetchService.client';

const service = new SettingFetchService();

// Get all settings
const settings = await service.get();

// Get by ID
const setting = await service.getById('uuid');

// Get by terminal ID
const terminalSetting = await service.getByTerminalId('terminal-123');

// Create new setting
const newSetting = await service.create({
  terminalId: 'terminal-123',
  subscriptionEndpoint: 'https://...',
  subscriptionKeysP256dh: 'key...',
  subscriptionKeysAuth: 'auth...',
  notificationEnabled: true,
  notificationTime: 9
});

// Update setting
const updatedSetting = await service.update(setting);

// Delete setting
await service.delete('uuid');
```

## エラーハンドリング

全てのAPIエンドポイントとフェッチサービスは適切なエラーハンドリングを実装しています：

- **400 Bad Request**: 不正なリクエストデータ
- **404 Not Found**: リソースが見つからない
- **500 Internal Server Error**: サーバー内部エラー

フェッチサービスではエラーを console.error でログ出力し、呼び出し元に re-throw します。

## データ型

### FreshnessDataType
```typescript
interface FreshnessDataType {
  id: string;
  name: string;
  expiryDate: string; // 賞味期限（年月日まで）
  notificationEnabled: boolean; // 通知可否
  create: number;
  update: number;
}
```

### SettingDataType
```typescript
interface SettingDataType {
  id: string;
  terminalId: string; // 端末を判別するためのID
  subscriptionEndpoint: string;
  subscriptionKeysP256dh: string;
  subscriptionKeysAuth: string;
  notificationEnabled: boolean; // 通知可否
  notificationTime: number; // 通知タイミング（時間指定）
  create: number;
  update: number;
}
```

## 関連ドキュメント

- [FreshnessNotifier Business Logic](../../freshness-notifier/README.md)
- [Common Client Documentation](../common/client/README.md)
- [Common Module Overview](../common/README.md)