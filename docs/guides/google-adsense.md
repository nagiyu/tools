# Google Adsense 対応

このドキュメントでは、CommonLayout に Google Adsense を設定する方法を説明します。

## 概要

CommonLayout コンポーネントに Google Adsense サポートが追加されました。これにより、アプリケーション全体で Google Adsense 広告を簡単に設定できます。

## 設定方法

### 1. AdsenseConfig の設定

```typescript
import { AdsenseConfig } from '@client-common/components/layout/CommonLayout';

const adsenseConfig: AdsenseConfig = {
  publisherId: 'ca-pub-xxxxxxxxxx', // Google Adsense のパブリッシャーID
  enableAutoAds: true, // 自動広告を有効にする場合はtrue（オプション）
  adSlot: 'xxxxxxxxx', // 特定の広告スロット（オプション）
};
```

### 2. CommonLayout での使用

```typescript
import CommonLayout, { AdsenseConfig } from '@client-common/components/layout/CommonLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommonLayout
      title="Your App Title"
      adsenseConfig={adsenseConfig}
    >
      {children}
    </CommonLayout>
  );
}
```

## パラメータ

### AdsenseConfig

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| `publisherId` | `string` | ✓ | Google Adsense のパブリッシャーID（ca-pub-xxxxxxxxxx 形式） |
| `enableAutoAds` | `boolean` | - | 自動広告を有効にするかどうか（デフォルト: false） |
| `adSlot` | `string` | - | 特定の広告スロットID（将来の拡張用） |

## 動作

Google Adsense が設定されると、以下の処理が自動的に行われます：

1. **Adsense スクリプトの読み込み**: Google Adsense の JavaScript ライブラリが自動的にページに読み込まれます
2. **自動広告の有効化**: `enableAutoAds` が `true` の場合、ページレベルの自動広告が有効になります

## 注意事項

- `publisherId` は Google Adsense アカウントから取得した正しいパブリッシャーIDを使用してください
- 自動広告を有効にする場合は、Google Adsense の管理画面でも適切に設定されていることを確認してください
- テスト環境では実際の広告が表示されない場合があります

## 例

```typescript
// 基本的な設定例
const adsenseConfig: AdsenseConfig = {
  publisherId: 'ca-pub-1234567890123456',
  enableAutoAds: true,
};

// 最小限の設定例
const adsenseConfig: AdsenseConfig = {
  publisherId: 'ca-pub-1234567890123456',
};
```