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

## CI（GitHub Actions）

- タグ `v[0-9]+.[0-9]+.[0-9]+` の push をトリガに、`pnpm publish --access public` を実行
- ワークフローは `.github/workflows/publish.yml`
- 重複実行防止: 同一 ref では 1 つのワークフローのみ実行
- 既存バージョンチェック: npm に同じバージョンがある場合は publish をスキップ

## トラブルシュート

### 403 Forbidden エラー

- **原因**: 同じバージョンを再公開しようとしている
- **対策**: バージョンを上げてから再度リリース

### 2FA 関連

- npm で 2FA を「発行時必須」にしている場合は Automation Token を使用
- CI での publish には「Automation」タイプのトークンが必要

### その他

- 失敗する場合は Secrets の `NPM_TOKEN` を再設定
- Actions の実行ログで詳細なエラーを確認
