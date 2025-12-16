# Release Guide

このライブラリは Git タグ `vX.Y.Z` を push すると GitHub Actions が自動で npm に公開します。

## 前提

- GitHub Secrets に `NPM_TOKEN`（npm Automation Token）を登録

## 手順（推奨: np を利用）

**重要**: `np` はタグを自動で push するため、手動での `git push --follow-tags` は不要です。

### 対話で実行

```bash
pnpm release
# → patch/minor/major を選択
# タグが自動で push され、CI が起動します
```

### 非対話で実行（例: パッチ）

```bash
npx np patch --no-publish --yolo --any-branch
# タグが自動で push され、CI が起動します
```

### 手動でのタグ push（非推奨）

```bash
npm version patch
git push origin master --follow-tags
```

## ビルドについて

- リリースは GitHub Actions 上で実行され、publish 前に `pnpm install --frozen-lockfile` と `pnpm exec tsc` を実行してビルドします（`Build` ステップ）。そのため、ローカルでのビルドは必須ではありません。
- タグを切る前にローカルで型・ビルドを検証したい場合は、以下を実行してください。

```bash
pnpm install
pnpm exec tsc
# または（package.json の prepare を利用）
pnpm run prepare
```

- CI の Node バージョンは 20 です（`actions/setup-node@v4` で指定）。

## CI（GitHub Actions）

- タグ `v[0-9]+.[0-9]+.[0-9]+` の push をトリガに、`pnpm publish --access public` を実行
- ワークフローは `.github/workflows/publish.yml`
- 重複実行防止: 同一 ref では 1 つのワークフローのみ実行
- 既存バージョンチェック: npm に同じバージョンがある場合は publish をスキップ

## トラブルシュート

### 403 Forbidden エラー

- **原因**: 同じバージョンを再公開しようとしている
- **対策**: バージョンを上げてから再度リリース

### `Access token expired or revoked` / 404 Not Found（PUT が 404）

- **原因**: `NPM_TOKEN` が失効・取り消し・権限不足（npm は権限不足時に 404 を返すことがあります）
- **対策**:
  - npm で **Automation Token** を作り直す
  - GitHub Secrets の `NPM_TOKEN` を更新する
  - Secrets 更新後は **同じタグ（例: `vX.Y.Z`）の workflow を Re-run** すればOK（新しいバージョン/タグを切る必要はありません）

### 2FA 関連

- npm で 2FA を「発行時必須」にしている場合は Automation Token を使用
- CI での publish には「Automation」タイプのトークンが必要

### `EOTP`（ワンタイムパスワード要求）

- **症状**: `npm error code EOTP` / `This operation requires a one-time password`
- **原因**: `NPM_TOKEN` が Automation Token ではない（または npm アカウントの 2FA 設定により OTP が必須）
- **対策**:
  - npm で **Automation Token** を作成し、GitHub Secrets の `NPM_TOKEN` を差し替える
  - その後、**同じタグ（例: `vX.Y.Z`）の workflow を Re-run** すればOK（新しいバージョン/タグは不要）

### その他

- 失敗する場合は Secrets の `NPM_TOKEN` を再設定
- Actions の実行ログで詳細なエラーを確認
