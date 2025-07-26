# BasicDialog コンポーネント追加計画

## 概要
MaterialUIのDialogコンポーネントを参考に、共通ダイアログコンポーネント（BasicDialog）を作成する計画です。これにより、他機能からのダイアログ利用を統一し、UIの一貫性を保ちます。

## 目的
- MaterialUI Dialogの機能を活用しつつ、依存関係を最小限に抑えた共通ダイアログを提供する。
- 他機能からの利用時にMaterialUIのパッケージが必須でない設計とする（peerDependencies化やfallback実装を検討）。
- サンプル実装を通じて利用例を示し、開発者の理解を促進する。

## 設計方針

### 1. BasicDialogコンポーネントの実装
- MaterialUIのDialogコンポーネントをベースに作成。
- propsで開閉制御、タイトル、内容、アクションボタンなどを受け取る。
- MaterialUIがインストールされていない環境でも動作可能な設計を検討（peerDependencies化や動的import、fallback実装など）。

### 2. サンプルページの作成
- `client/nextjs-sample/app/sample/dialogs/page.tsx` にBasicDialogの多様な利用例を実装。
- 開閉制御、カスタムタイトル、内容、アクションボタンの例を示す。
- 既存のサンプル部品を再利用し、コードの重複を避ける。

### 3. メニューへのリンク追加
- `client/nextjs-sample/app/layout.tsx` のmenuItemsにサンプルページへのリンクを追加。

## 依存関係
- MaterialUIのDialogコンポーネントを利用。
- ただし、他機能からの利用時にMaterialUIが必須でない設計を目指す。

## 今後の課題
- 実装後の動作検証。
- 他機能からの利用時の依存関係管理。
- UI/UXの改善。

## 参考情報
- MaterialUI Dialog: https://mui.com/material-ui/react-dialog/

---

以上がBasicDialog追加計画の概要と設計方針です。
