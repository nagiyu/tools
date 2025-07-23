# tasks/update-common-workflow-remote-merge.md

## 概要
update-common.yml ワークフローを https://github.com/nagiyu/nagiyu-aws-serverless-template.git の master ブランチをクローンし、@nagiyu/nagiyu-aws-serverless-sample からマージする方式に変更する計画です。

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
- また、actions/checkout@v3 でチェックアウトするリポジトリは作業元リポジトリ（https://github.com/nagiyu/nagiyu-aws-serverless-sample.git）であり、テンプレートリポジトリ（https://github.com/nagiyu/nagiyu-aws-serverless-template.git）ではありません。

### 改善案
- テンプレートリポジトリ（https://github.com/nagiyu/nagiyu-aws-serverless-template.git）の master ブランチをクローンし、作業元リポジトリにマージする方式に変更します。
- これにより、テンプレートの最新状態を直接取り込み、管理を一元化できます。

### 実装例
以下は .github/workflows/update-common.yml を修正する例です。

```yaml
name: Update Common Workflow

on:
  schedule:
    - cron: '0 0 * * *'

jobs:
  update-common:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout nagiyu-aws-serverless-template
        uses: actions/checkout@v3
        with:
          repository: nagiyu/nagiyu-aws-serverless-template
          ref: master
          path: template

      - name: Checkout current repository
        uses: actions/checkout@v3
        with:
          path: current

      - name: Merge template master into current
        run: |
          cd current
          git remote add template ../template
          git fetch template master
          git merge template/master

      - name: Push changes
        run: |
          cd current
          git push origin main

      - name: Configure Git
        run: |
          git config user.name "github-actions"
          git config user.email "github-actions@github.com"

      - name: Merge template into current repository
        run: |
          git remote add template ./template
          git fetch template
          git merge template/master --allow-unrelated-histories -m "Merge template master branch"

      - name: Push changes
        run: |
          git push origin HEAD:refs/heads/main
```

### 注意点
- マージ時のコンフリクト対応が必要になる可能性がある。
- 運用ルールとして、テンプレートリポジトリの更新を定期的に反映することを推奨する。

### 新方式の概要
- https://github.com/nagiyu/nagiyu-aws-serverless-template.git の master ブランチを直接クローンし、
  その上で作業元リポジトリ（https://github.com/nagiyu/nagiyu-aws-serverless-sample.git）をリモートとして追加します。
- そこから最新の変更をフェッチしてマージする方式に変更します。
- これにより、テンプレートリポジトリの最新の master ブランチを正確に取得し、作業元リポジトリの変更と効率的に統合できます。

### 具体的な手順
1. actions/checkout@v3 でリポジトリをチェックアウト
2. git remote add nagiyu https://github.com/nagiyu/nagiyu-aws-serverless-template.git を実行してリモートを追加
3. git fetch nagiyu master を実行してリモートの master ブランチを取得
4. git merge nagiyu/master を実行してローカルの master ブランチにマージ
5. 必要に応じてコンフリクト解消や追加の操作を行う


### 注意点
- マージ時にコンフリクトが発生した場合の対応方法を検討する必要があります。
- 自動マージが難しい場合は手動対応や通知を行う仕組みを検討してください。
- マージ後の動作確認やテストも重要です。

## まとめ
- リモートの master ブランチから直接マージする方式に変更することで、運用効率と管理容易性が向上します。
- 本計画をもとに実装を進めてください。
