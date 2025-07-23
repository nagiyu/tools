# update-common.yml ワークフローのリモート master マージ方式への移行計画

## 概要
update-common.yml ワークフローを https://github.com/nagiyu/nagiyu-aws-serverless-template.git の master ブランチをクローンし、@nagiyu/nagiyu-aws-serverless-sample からマージする方式に変更する計画。

## 詳細
- 現状は actions/checkout@v3 でチェックアウトしたリポジトリに対して操作しています。
- add & commit 方式ではなく、リモートからマージする方式にすることで運用効率や管理容易性を高めることが目的です。
- 本 issue は計画するだけです。
- tasks/update-common-workflow-remote-merge.md 配下に計画をよく考えて、日本語で記入してください。
- 必要なファイルの読み込みなど調査を行い、できるだけ具体的に計画してください。
- 可能な限り、実装例も記述してください。

## 計画

### 現状の問題点
- 現状の update-common.yml は actions/checkout@v3 でリポジトリをチェックアウトし、変更を add & commit してプッシュし、プルリクエストを作成する方式です。
- この方式は変更管理が煩雑になりやすく、運用効率が低い可能性があります。

### 新方式の概要
- https://github.com/nagiyu/nagiyu-aws-serverless-template.git の master ブランチをリモートとして追加し、
  そこから最新の変更をフェッチしてマージする方式に変更します。
- これにより、変更はリモートの master ブランチから直接取り込み、ローカルでのコミットやプッシュ操作を減らせます。

### 具体的な手順
1. actions/checkout@v3 でリポジトリをチェックアウト
2. git remote add nagiyu https://github.com/nagiyu/nagiyu-aws-serverless-template.git を実行してリモートを追加
3. git fetch nagiyu master を実行してリモートの master ブランチを取得
4. git merge nagiyu/master を実行してローカルの master ブランチにマージ
5. 必要に応じてコンフリクト解消や追加の操作を行う

### 実装例（update-common.yml の一部変更例）
```yaml
jobs:
  update-common:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup git remote
        run: |
          git remote add nagiyu https://github.com/nagiyu/nagiyu-aws-serverless-template.git
          git fetch nagiyu master
          git merge nagiyu/master

      # 以降は必要に応じて追加のステップを記述
```

### 注意点
- マージ時にコンフリクトが発生した場合の対応方法を検討する必要があります。
- 自動マージが難しい場合は手動対応や通知を行う仕組みを検討してください。
- マージ後の動作確認やテストも重要です。

## まとめ
- リモートの master ブランチから直接マージする方式に変更することで、運用効率と管理容易性が向上します。
- 本計画をもとに実装を進めてください。
