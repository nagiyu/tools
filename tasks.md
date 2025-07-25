# Stacksサンプルページ追加計画

## 概要
client/common/components/Layout/Stacks/BasicStack.tsx と DirectionStack.tsx のサンプルページを client/nextjs-sample/app/sample-stacks/page.tsx に追加し、BasicStack・DirectionStackの利用例を掲載する。
また、client/nextjs-sample/app/layout.tsx の menuItems に「Stacksサンプル」リンクを追加する。

## 調査内容

### 1. BasicStack.tsx
- MUIのStackコンポーネントをラップしたシンプルなスタックコンポーネント。
- spacingプロパティで子要素間の間隔を調整可能。
- childrenを受け取り、Stack内に配置する。

### 2. DirectionStack.tsx
- MUIのStackコンポーネントをラップし、direction="row"で横方向のスタックを実現。
- spacing, justifyContent, alignItemsのプロパティを受け取り、レイアウト調整が可能。
- childrenを受け取り、横並びのStack内に配置する。

### 3. client/nextjs-sample/app/layout.tsx
- Next.jsのRootLayoutコンポーネント。
- menuItemsはgetMenuItems関数で生成されている。
- 現状のmenuItemsはHome, Sample Button, Sample Date Picker, User Data（ログイン時）
- ここに「Stacksサンプル」リンクを追加する必要がある。

### 4. client/nextjs-sample/app/sample-stacks/page.tsx
- 現状存在しないため新規作成が必要。
- BasicStackとDirectionStackの利用例を示すサンプルページを作成。

## 実装案

### 1. client/nextjs-sample/app/layout.tsx の修正案
- getMenuItems関数内のmenuItems配列に
  { title: 'Stacksサンプル', url: '/sample-stacks' } を追加する。

### 2. client/nextjs-sample/app/sample-stacks/page.tsx の新規作成案
- BasicStackとDirectionStackをimport。
- それぞれのスタックの使い方を示す。
- 例えば、BasicStackは縦方向にボタンを並べる例。
- DirectionStackは横方向にボタンを並べる例。
- MUIのButtonコンポーネントを使い、見た目もわかりやすくする。
  - Button コンポーネントは client/common/components/inputs/Buttons/ContainedButton.tsx を利用する。

## 注意事項
- 本issueは計画のみのため、tasks/stack.md以外のファイルは変更しない。
- 実装は別issueで行う。

## まとめ
- BasicStackとDirectionStackの特徴を活かしたサンプルページを作成し、
  layout.tsxのメニューにリンクを追加する計画を立てた。
- これにより、利用者がスタックコンポーネントの使い方を理解しやすくなる。
