# @soichiro_nitta/motion

https://www.npmjs.com/package/@soichiro_nitta/motion

軽量な DOM トランジションユーティリティ。要素の `transform`/CSS を手早くアニメーションさせるためのミニマル API を提供します。

## インストール

```bash
pnpm add @soichiro_nitta/motion
```

## クイックスタート（Next.js 推奨構成）

1. クライアント専用モジュールを用意（例: `app/(default)/motion.ts`）

```ts
'use client'

import { createMotion } from '@soichiro_nitta/motion'

export const { ID, motion } = createMotion(['Box', 'Title'] as const)
```

2. コンポーネントで利用

```tsx
'use client'
import { useEffect } from 'react'
import { ID, motion } from '~/app/(default)/motion'

export default function Example() {
  useEffect(() => {
    // 0.5秒でフェードイン
    void motion.to(ID.Box, 0.5, 'out', { opacity: '1' })
  }, [])

  return (
    <div>
      <div id={ID.Box.N} style={{ opacity: 0 }}>
        Hello
      </div>
      <h1 id={ID.Title.N}>Title</h1>
    </div>
  )
}
```

## 素の DOM での利用

```ts
import { createMotion } from '@soichiro_nitta/motion'

const { ID, motion } = createMotion(['Box'] as const)
await motion.to(ID.Box, 0.3, 'inout', { translateX: '20px', opacity: '0.8' })
```

## API

- `createMotion(names: string[])`

  - 指定した `id` 名に対してアクセスヘルパ `ID` と操作関数群 `motion` を返します。
  - 返り値: `{ ID, motion }`

- `ID[name]`

  - `name` に紐づく要素参照のヘルパ。`ID.Box.N` は `id` 文字列、`ID.Box.E()` は `HTMLElement` を返します。
  - 通常は `motion.*` の `target` に `ID.name` を渡せばよいです。

- `motion.set(target, values)`

  - 直ちにスタイルを適用します（トランジションなし）。

- `motion.to(target, duration, easing, values)`

  - 指定秒数で目的のスタイルにトランジションします。
  - `easing`: `in | out | inout | bounce | linear`

- `motion.repeat(target, duration, values)`

  - 同一トランジションを繰り返します。`{ pause, play }` を返します。

- `motion.get(target, property)`

  - 計算後スタイルを取得します。

- `motion.delay(seconds)`
  - `seconds` 秒待機する `Promise<void>`。

## 注意（Client-only）

本モジュールはクライアント専用です。RSC から参照された場合は `react-server` 条件エクスポートによりスタブが返り、エラーになります。アプリ側モジュールに `'use client'` を付与してください。
