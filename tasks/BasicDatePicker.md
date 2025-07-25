# BasicDatePickerコンポーネント追加計画

## 目的
- 日付入力を汎用的に提供するBasicDatePickerコンポーネントを作成し、他画面での再利用性を高める。
- UIパーツのサンプル集として、BasicDatePickerの使用例を示すサンプルページを作成し、使い勝手を検証できるようにする。
- ナビゲーションメニューにサンプルページへのリンクを追加し、アクセスしやすくする。

## 対象ファイル
- `client/common/components/inputs/Dates/BasicDatePicker.tsx`（新規作成）
- `client/nextjs-sample/app/sample-date-picker/page.tsx`（新規作成）
- `client/nextjs-sample/app/layout.tsx`（menuItemsにリンク追加）

## 詳細設計

### 1. BasicDatePickerコンポーネント
- MUI X Date PickersのDatePickerを利用。
- 日付の選択を行い、選択された日付を親コンポーネントに渡すためのonChangeハンドラを持つ。
- 必要に応じて、初期値（value）や最小・最大日付の制限をpropsで受け取る。
- フォーマットは標準的なyyyy/MM/ddなどを想定。
- 可能であれば、Material UIのTextFieldをカスタマイズして使用。

#### 例（TypeScript）
```tsx
import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';

interface BasicDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

export const BasicDatePicker: React.FC<BasicDatePickerProps> = ({ value, onChange, minDate, maxDate }) => {
  return (
    <DatePicker
      label="日付を選択"
      value={value}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      renderInput={(params) => <TextField {...params} />}
    />
  );
};
```

### 2. サンプルページ（`sample-date-picker/page.tsx`）
- ReactのuseStateで日付の状態を管理。
- BasicDatePickerを配置し、選択した日付を画面に表示。
- 簡単な説明文を追加。

#### 例
```tsx
'use client';

import * as React from 'react';
import { BasicDatePicker } from 'client/common/components/inputs/Dates/BasicDatePicker';

export default function SampleDatePickerPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  return (
    <div>
      <h1>BasicDatePicker サンプル</h1>
      <BasicDatePicker value={selectedDate} onChange={setSelectedDate} />
      <p>選択された日付: {selectedDate ? selectedDate.toLocaleDateString() : '未選択'}</p>
    </div>
  );
}
```

### 3. ナビゲーションメニューへのリンク追加（`layout.tsx`）
- `menuItems`配列に以下のようなオブジェクトを追加。
```ts
{
  label: 'Sample Date Picker',
  href: '/sample-date-picker',
}
```

## 実装手順
1. `BasicDatePicker.tsx`を作成し、MUIのDatePickerをラップしたコンポーネントを実装。
2. `sample-date-picker/page.tsx`を作成し、BasicDatePickerの使用例を実装。
3. `layout.tsx`のmenuItemsにリンクを追加。
4. 動作確認およびUIの調整。

## 参考情報
- [MUI X Date Pickers](https://mui.com/x/react-date-pickers/)

---

以上の計画に基づき、実装を進めていきます。
