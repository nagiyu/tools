# update-common.yml 作成 & remote へのドラフトPR作成ワークフロー計画

## 目的

- プロジェクトの自動化・共通ジョブ実装のため、GitHub Actions を活用して update-common.yml ワークフローを作成する。
- AWS SecretsManager からシークレットを取得し、git remote の追加やドラフトプルリクエスト作成を自動化する。

## 概要

- `.github/workflows/update-common.yml` を新規作成する。
- AWS CLI のインストールと設定を行う。
- GitHub Secrets に登録された AWS 認証情報を用いて AWS CLI を認証する。
- AWS SecretsManager から必要なシークレットを取得する。
- git remote に `@nagiyu/nagiyu-aws-serverless-template` を追加する。
- 新しいブランチ `feature/update-common-$(date +%Y%m%d-%H%M%S)` を作成し、そのブランチで作業を行う。
- git のユーザー名とメールアドレスを `GITHUB_USERNAME` と `GITHUB_EMAIL` で設定する。
- `.github/workflows/update-common.yml` 自体はコミット対象から除外する。
- GitHub 認証は `${{ env.GITHUB_PERSONAL_ACCESS_TOKEN }}` を使用する。
- プルリクエストはドラフトとして作成する。

## 詳細設計

### 1. ワークフローのトリガー
- 手動トリガー（workflow_dispatch）を設定し、必要に応じて実行可能にする。

### 2. ジョブ構成
- `update-common` ジョブを作成。
- `runs-on: ubuntu-latest` を指定。

### 3. ステップ詳細

#### a. AWS CLI インストール
- `aws-cli` をインストールするステップを追加。

#### b. AWS 認証情報の設定
- GitHub Secrets から `AWS_ACCESS_KEY_ID` と `AWS_SECRET_ACCESS_KEY` を取得し、環境変数に設定。
- `aws configure` コマンドで設定。

#### c. AWS SecretsManager からシークレット取得
- `aws secretsmanager get-secret-value` コマンドを使用し、必要なシークレットを取得。
- 取得したシークレットは環境変数やファイルに保存して後続処理で利用可能にする。

#### d. git remote 追加
- `git remote add nagiyu https://github.com/nagiyu/nagiyu-aws-serverless-template.git` を実行。

#### e. ブランチ作成とチェックアウト
- `feature/update-common-$(date +%Y%m%d-%H%M%S)` 形式のブランチを作成し、チェックアウト。

#### f. git 設定
- `git config user.name ${{ env.GITHUB_USERNAME }}`
- `git config user.email ${{ env.GITHUB_EMAIL }}`

#### g. コミット除外設定
- `.github/workflows/update-common.yml` をコミット対象から除外するため、`.gitignore` に追加（必要に応じて）。

#### h. 変更のコミットとプッシュ
- 変更があればコミット。
- `git push nagiyu HEAD:refs/heads/feature/update-common-$(date +%Y%m%d-%H%M%S)` を実行。

#### i. ドラフトプルリクエスト作成
- `peter-evans/create-pull-request` アクションを使用し、ドラフトPRを作成。
- タイトルや本文は適宜設定。

## 実装例

```yaml
name: Update Common

on:
  workflow_dispatch:

jobs:
  update-common:
    runs-on: ubuntu-latest
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      GITHUB_USERNAME: ${{ secrets.GITHUB_USERNAME }}
      GITHUB_EMAIL: ${{ secrets.GITHUB_EMAIL }}
      GITHUB_PERSONAL_ACCESS_TOKEN: ${{ secrets.GITHUB_PERSONAL_ACCESS_TOKEN }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Install AWS CLI
        run: |
          curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
          unzip awscliv2.zip
          sudo ./aws/install

      - name: Configure AWS CLI
        run: |
          aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
          aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
          aws configure set default.region ap-northeast-1

      - name: Get secrets from AWS SecretsManager
        id: get_secrets
        run: |
          SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id your-secret-id --query SecretString --output text)
          echo "$SECRET_JSON" > secret.json

      - name: Setup git remote
        run: |
          git remote add nagiyu https://github.com/nagiyu/nagiyu-aws-serverless-template.git

      - name: Create and checkout branch
        run: |
          BRANCH_NAME=feature/update-common-$(date +'%Y%m%d-%H%M%S')
          git checkout -b $BRANCH_NAME

      - name: Configure git user
        run: |
          git config user.name ${{ env.GITHUB_USERNAME }}
          git config user.email ${{ env.GITHUB_EMAIL }}

      - name: Commit changes
        run: |
          git add .
          git reset -- .github/workflows/update-common.yml
          git commit -m "Update common workflow"
          git push nagiyu HEAD:$BRANCH_NAME

      - name: Create draft pull request
        uses: peter-evans/create-pull-request@v4
        with:
          token: ${{ env.GITHUB_PERSONAL_ACCESS_TOKEN }}
          title: "[Draft] Update common workflow"
          body: "This is an automated draft PR to update common workflow."
          base: main
          head: $BRANCH_NAME
          draft: true
```

## 注意点

- SecretsManager の secret-id は適宜変更すること。
- `.github/workflows/update-common.yml` はコミット対象から除外するため、`git reset` で除外している。
- GitHub Actions のトークンは Secrets に登録されたものを使用する。
- ブランチ名は日時でユニークにする。
- ドラフトPR作成には `peter-evans/create-pull-request` アクションを利用。

---

以上が update-common.yml 作成と remote へのドラフトPR作成ワークフローの計画です。
