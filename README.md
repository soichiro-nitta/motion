# @soichiro_nitta/motion

https://www.npmjs.com/package/@soichiro_nitta/motion

軽量な DOM トランジションユーティリティ。要素の `transform`/CSS を手早くアニメーションさせるためのミニマル API を提供します。

## インストール

```bash
pnpm add @soichiro_nitta/motion
```

## クイックスタート（Next.js 推奨構成）

1. ID を共通モジュール（例: `app/id.ts`）で定義

```ts
import { createId } from '@soichiro_nitta/motion'

export const ID = createId(['BOX', 'TITLE'])
```

Next.js App Router ではこの `ID` モジュールを RSC/Client のどちらからでも参照できるため、ID を一箇所で管理できます。

2. クライアント専用モジュールを用意（例: `app/motion.ts`）

```ts
'use client'
import { createMotion } from '@soichiro_nitta/motion'
import { ID } from './id'

// `createMotion(ID)` により、第一引数の候補は `keyof typeof ID` になる
export const { motion } = createMotion(ID)
```

3. コンポーネントで利用（矢印関数 + default export 名は Page）

```tsx
'use client'
import { useEffectAsync } from '@soichiro_nitta/motion'
import { ID } from '@/app/id'
import { motion } from '@/app/motion'

const Page = () => {
  useEffectAsync(async () => {
    await motion.delay(0.1)
    await motion.to('BOX', 0.5, 'out', { opacity: '1' })
    await motion.to('TITLE', 0.5, 'out', { opacity: '1', translateY: '0px' })
  }, [])

  return (
    <div>
      <div id={ID.BOX.N} style={{ opacity: 0 }}>
        Hello
      </div>
      <h1 id={ID.TITLE.N}>Title</h1>
    </div>
  )
}

export default Page
```

- `useEffectAsync` は `async/await` をそのまま書けるようにするラッパーで、内部で `void` を付けたり Promise を捨てたりする必要がありません。
- Next.js 16 でのフル実装例（RSC + Client 分離）は検証リポジトリ [motion-rsc-test](https://github.com/soichiro-nitta/motion-rsc-test) を参照してください。

## ID の使い方

`createId` や `createMotion` が返す `ID` はキーごとに `N`（id 文字列）と `E()`（DOM 参照）を持ち、`motion.*` で利用する第1引数のキーとも一致します。

- `ID.BOX.N`: RSC でも安全な `id` 文字列。`<div id={ID.BOX.N} />` のように使えます。
- `ID.BOX.E()`: ブラウザで `HTMLElement` を返す関数。`'use client'` なモジュール内でのみ利用できます。
- `ID.BOX.E()` は初回アクセス時に `document.getElementById` で取得した要素をキャッシュし、2 回目以降は同じ参照を返すため、繰り返し操作でも DOM 探索コストを抑えられます。
- `motion.to('BOX', …)` の `'BOX'` は上記キーのエイリアスで、DOM 探索をライブラリが肩代わりします。`ID.BOX.E()` で取得した要素を直接渡すことも可能です。

`app/id.ts` のようなファイルに ID 定義を集約しておくと一箇所で管理できます。Next.js App Router ではこのファイルを RSC/Client どちらからでも import できるため、全ページで同じキーを参照できます。以下はクイックスタート構成（`app/id.ts` で `ID` をエクスポート）を想定した例です。

```tsx
// app/page.tsx（RSC）
import { ID } from '@/app/id'

const Page = () => (
  <div id={ID.BOX.N}>
    Content
  </div>
)

export default Page
```

```tsx
// app/(home)/_Client/runMotion.ts（Client）
'use client'
import { createMotion } from '@soichiro_nitta/motion'
import { ID } from '@/app/id'

const { motion } = createMotion(ID)

export const runMotion = async () => {
  await motion.to('BOX', 0.3, 'inout', { opacity: '0.8' })
  const elementBox = ID.BOX.E()
  await motion.to(elementBox, 0.2, 'out', { opacity: '1' })
}
```

## 素の DOM での利用

```ts
import { createMotion } from '@soichiro_nitta/motion'

const { ID, motion } = createMotion(['BOX'])
await motion.to('BOX', 0.3, 'inout', { translateX: '20px', opacity: '0.8' })
```

## API

- `createId(names: string[])`

  - サーバー（RSC）でも安全に利用できる ID 辞書を返します。
  - 返り値: `{ ID }`（`ID.NAME.N` のみ保持）

- `createMotion(names: string[])`
  
  - 指定した `id` 名、または `createId` が返す ID 辞書を受け取り、DOM アクセス付き `ID` と操作関数群 `motion` を返します。
  - 返り値: `{ ID, motion }`

- `ID[name]`

  - `name` に紐づく要素参照のヘルパ。`ID.BOX.N` は `id` 文字列、`ID.BOX.E()` は `HTMLElement` を返します。
  - `createMotion(ID)` を利用すると `motion.*` の第一引数が `keyof typeof ID`（例: `'BOX' | 'TITLE'`） で補完されます。

- `motion.set(target, values)`

  - 直ちにスタイルを適用します（トランジションなし）。

- `motion.to(target, duration, easing, values)`

  - 指定秒数で目的のスタイルにトランジションします。
  - `target` は `HTMLElement` か `createMotion(ID)` 由来のキー列挙（例: `'BOX'`）を受け取ります。
  - `easing`: `in | out | inout | bounce | linear`
  - 変形は個別キーで指定します（例: `translateX`, `rotate`, `scale`）。複合 `transform` は渡さないでください。

- `motion.repeat(target, duration, values)`

  - 同一トランジションを繰り返します。`{ pause, play }` を返します。

- `motion.get(target, property)`

  - 計算後スタイルを取得します。

- `motion.delay(seconds)`
  - `seconds` 秒待機する `Promise<void>`。

- `useEffectAsync(effect, deps)`
  - `async/await` をそのまま書ける `useEffect` の薄いラッパー。`effect` が `Promise` を返した場合も自動でハンドリングし、戻り値のクリーンアップがあれば通常の `useEffect` 同様に実行されます。

## 注意（Client-only）

- `createId` は RSC から参照可能ですが、`createMotion`/`motion.*`/`ID.*.E()` はブラウザ専用です。
- ブラウザ環境でない場合にクライアント API を呼び出すと例外を投げます。クライアント用モジュールには `'use client'` を付与してください。
