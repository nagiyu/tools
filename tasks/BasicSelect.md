# BasicSelect コンポーネントのサンプルページ追加計画

## 概要
BasicSelect コンポーネント（client/common/components/inputs/Selects/BasicSelect.tsx）の使い方を示すサンプルページを追加します。サンプルページは client/nextjs-sample/app/sample-select/page.tsx に作成し、BasicSelect の主要な props（label, options, value, onChange など）を設定した動作例を掲載します。

また、client/nextjs-sample/app/layout.tsx の menuItems にサンプルページへのリンクを追加し、画面遷移ができるようにします。

## 調査内容
- BasicSelect コンポーネントは client/common/components/inputs/Selects/BasicSelect.tsx に存在。
- Next.js のサンプルページは client/nextjs-sample/app ディレクトリ配下にある。
- 画面遷移用のメニューは client/nextjs-sample/app/layout.tsx の menuItems 配列で管理されている。

## 実装計画
1. client/nextjs-sample/app/sample-select/page.tsx を新規作成。
  - BasicSelect をインポート。
  - useState で選択値の state を管理。
  - label, options, value, onChange を設定し、BasicSelect の動作例を示す。
  - 選択値の変更が画面に反映されるようにする。

2. client/nextjs-sample/app/layout.tsx の menuItems に以下のリンクを追加。
  ```tsx
  {
    label: 'Sample Select',
    href: '/sample-select',
  },
  ```

## 実装例
### sample-select/page.tsx
```tsx
import React, { useState } from 'react';
import BasicSelect from 'client/common/components/inputs/Selects/BasicSelect';

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

export default function SampleSelectPage() {
  const [value, setValue] = useState('option1');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as string);
  };

  return (
    <div>
      <h1>BasicSelect コンポーネントのサンプル</h1>
      <BasicSelect
        label="Select an option"
        options={options}
        value={value}
        onChange={handleChange}
      />
      <p>選択中の値: {value}</p>
    </div>
  );
}
```

### layout.tsx の menuItems 追加例
```tsx
const menuItems = [
  // 既存のメニュー項目
  {
    label: 'Sample Select',
    href: '/sample-select',
  },
];
```

## 完了条件
- tasks/BasicSelect.md が日本語で作成されていること
- 実装例が具体的に記載されていること
- 他のファイルは変更しないこと

## 参考情報
- Material UI Select コンポーネント: https://mui.com/material-ui/react-select/
- BasicSelect コンポーネントの実装を参考にすること
