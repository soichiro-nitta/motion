# @soichiro_nitta/motion
https://www.npmjs.com/package/@soichiro_nitta/motion

## リリースフロー

このパッケージは Git タグ `vX.Y.Z` を push すると GitHub Actions が自動で npm に公開します。

### 前提

- リポジトリ Secrets に `NPM_TOKEN` を登録（npm の Automation トークン）

### 手順（推奨: np を利用）

1. 作業ツリーをクリーンにする
2. バージョン更新・タグ作成（対話）

```bash
pnpm release
# → patch/minor/major を選択
git push origin master --follow-tags
```

非対話で実行する場合（例: パッチ）

```bash
npx np patch --no-publish --yolo --any-branch
git push origin master --follow-tags
```

### CI（GitHub Actions）

- タグ `v[0-9]+.[0-9]+.[0-9]+` の push をトリガに、`pnpm publish --access public` を実行します
- ワークフロー: `.github/workflows/publish.yml`

### RSC（React Server Components）対策

- RSC から本パッケージを参照した場合、`react-server` 条件エクスポートにより `rsc-stub.js` が選択され、明示的にエラーを投げます
- `package.json` の `exports` を参照
