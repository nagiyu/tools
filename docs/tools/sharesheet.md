# シェアシート対応

## 概要

このドキュメントは、Tools PWA アプリケーションのシェアシート対応について説明します。

## 機能

### Web Share Target API

Tools アプリは Web Share Target API を使用して、スマートフォンの共有ボタンから直接起動できます。

#### 対応する共有データ

- **URL**: ウェブページのURL
- **テキスト**: 任意のテキストデータ
- **タイトル**: 共有コンテンツのタイトル

### 使用方法

1. **スマートフォンでの操作**
   - 任意のアプリ（ブラウザ、SNS、メモアプリなど）で共有ボタンをタップ
   - 共有先一覧から「Tools」を選択
   - Tools アプリが起動し、共有データが表示される

2. **共有データの処理**
   - 共有ページ（`/share`）で共有されたデータを確認
   - 「ツールで変換処理」ボタンで Convert Transfer ツールに渡して処理
   - 「ホームに戻る」ボタンでホーム画面に移動

## 技術仕様

### PWA マニフェスト設定

```json
{
  "share_target": {
    "action": "/share",
    "method": "GET",
    "params": {
      "title": "title",
      "text": "text", 
      "url": "url"
    }
  }
}
```

### Next.js 対応

共有ページとConvert Transferページは、Next.jsのstatic generation対応のため以下の構造を採用：

- `useSearchParams()`を使用するコンポーネントをSuspenseバウンダリーでラップ
- ローディング状態には`LoadingPage`コンポーネント（Material-UI使用）を表示
- これによりコンパイル時エラーを回避し、適切なSSR/SSG対応を実現

### 実装ファイル

#### 1. マニフェスト設定
- **ファイル**: `client/tools/app/manifest.ts`
- **役割**: PWA マニフェストに `share_target` 設定を追加

#### 2. 共有ハンドラページ
- **ファイル**: `client/tools/app/share/page.tsx`
- **役割**: 共有されたデータを受け取り、ユーザーに表示・処理オプションを提供
- **構造**: Suspenseバウンダリーでラップされた`ShareContent`コンポーネント
- **ローディング**: `@client-common/pages/LoadingPage`コンポーネントを使用

#### 3. Convert Transfer ツール連携
- **ファイル**: `client/tools/app/convert-transfer/page.tsx`  
- **役割**: 共有されたURL/テキストを変換処理で利用
- **構造**: Suspenseバウンダリーでラップされた`ConvertTransferContent`コンポーネント
- **ローディング**: `@client-common/pages/LoadingPage`コンポーネントを使用

### データフロー

```
他のアプリ → 共有ボタン → Tools選択 → /share ページ（Suspense境界） → Convert Transfer ツール（Suspense境界）
```

### コンポーネント構造

```
SharePage
├── Suspense (fallback: LoadingPage)
└── ShareContent (useSearchParams使用)

ConvertTransferPage  
├── Suspense (fallback: LoadingPage)
└── ConvertTransferContent (useSearchParams使用)
```

## ブラウザ対応

- **Chrome（Android）**: 完全対応
- **Safari（iOS）**: iOS 15+ で対応
- **Edge（Windows）**: 部分対応
- **Firefox**: 実験的機能として対応

## セキュリティ考慮事項

- 共有されたURLは自動的には開かない
- ユーザーの明示的な操作が必要
- XSS攻撃を防ぐため、共有データはエスケープして表示

## テスト方法

1. **開発環境での確認**
   - Chrome DevTools の Application タブで PWA として認識されているか確認
   - マニフェストの `share_target` 設定が正しく読み込まれているか確認

2. **実機での確認**
   - PWA をホーム画面に追加
   - 他のアプリから共有操作を実行
   - Tools が共有先一覧に表示されることを確認

## 制限事項

- ファイル共有には対応していない（URL、テキストのみ）
- 一部のブラウザでは機能が制限される場合がある
- PWA としてインストールされている必要がある