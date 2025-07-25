# SimpleRadioGroup コンポーネント追加とサンプル実装計画

## 概要
Material UI の Radio Group をラップした SimpleRadioGroup コンポーネントを新規作成し、再利用可能な形で外部利用を可能にする計画を立案します。また、利用例となるサンプルページとメニューへの追加までを計画します。

## 詳細

1. **SimpleRadioGroup コンポーネント作成**
   - パス: `client/common/components/Inputs/RadioGroups/SimpleRadioGroup.tsx`
   - Material UI の Radio Group API をラップし、外部からラジオボタンの内容・個数・状態を管理できるようにする。
   - Material UI のパッケージを直接 import せず、SimpleRadioGroup.tsx のみ import すれば使用できる形にする。

2. **サンプルページ作成**
   - パス: `client/nextjs-sample/app/sample-radio-group/page.tsx`
   - SimpleRadioGroup の使い方サンプルを作成。

3. **メニューへのリンク追加**
   - パス: `client/nextjs-sample/app/layout.tsx`
   - `menuItems` にサンプルページへのリンクを追加し、ナビゲーションから遷移可能にする。

## 参考情報
- [Material UI Radio Button](https://mui.com/material-ui/react-radio-button/)

---

## 補足
- 本 issue は計画のみを目的とし、実装は含みません。
- 実装時は上記の詳細に従い、各ファイルを適切に作成・修正してください。
