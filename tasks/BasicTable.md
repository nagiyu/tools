# BasicTable コンポーネント追加計画

## 概要
MaterialUIに依存しない再利用可能な共通テーブルコンポーネント（BasicTable）を追加し、その利用例を示すサンプル画面の実装とメニュー連携を計画する。

## 方針
- BasicTableは内部でMaterialUIのTableを利用するが、BasicTable自体はMaterialUIに依存しない設計とする。
- BasicTableの実装は `client/common/components/data/table/BasicTable.tsx` に行う。
- サンプル画面は `client/nextjs-sample/app/sample/table/page.tsx` に複数の利用例を実装し、既存の `client/nextjs-sample/app/sample` 配下の部品も活用する。
- メニュー連携は `client/nextjs-sample/app/layout.tsx` の `menuItems` にテーブルサンプルへのリンクを追加する。

## 調査内容
- MaterialUIのTableコンポーネントのAPIと使い方を調査。
- 既存のサンプル画面や共通部品の構成を確認。
- MaterialUI依存を隠蔽するためのラップ方法を検討。

## 実装例
- BasicTableはpropsでカラム定義、データ、ページネーション、ソートなどの機能を受け取り、内部でMaterialUIのTableを使って表示。
- サンプル画面では複数のテーブル例を示し、BasicTableの使い方を明示。
- メニューにテーブルサンプルへのリンクを追加し、ユーザがアクセスしやすいようにする。

## 今後の課題
- BasicTableの機能拡張（フィルタリング、カスタムセルレンダリングなど）
- パフォーマンス最適化
- アクセシビリティ対応

## 参考情報
- MaterialUI Table: https://mui.com/material-ui/react-table/
- 既存のsample/app配下部品

---

以上。
