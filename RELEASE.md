# Release Guide

このライブラリは Git タグ `vX.Y.Z` を push すると GitHub Actions が自動で npm に公開します。

## 前提

- GitHub Secrets に `NPM_TOKEN`（npm Automation Token）を登録

## 手順（np を利用）

### 対話で実行

```bash
pnpm release
# → patch/minor/major を選択
git push origin master --follow-tags
```

### 非対話で実行（例: パッチ）

```bash
npx np patch --no-publish --yolo --any-branch
git push origin master --follow-tags
```

## CI（GitHub Actions）

- タグ `v[0-9]+.[0-9]+.[0-9]+` の push をトリガに、`pnpm publish --access public` を実行
- ワークフローは `.github/workflows/publish.yml`

## トラブルシュート

- npm で 2FA を「発行時必須」にしている場合は Automation Token を使用してください
- 失敗する場合は Secrets の `NPM_TOKEN` を再設定してください
