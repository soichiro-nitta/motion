import { BEZIER, CssTypes, TRANSFORM_PROPERTIES, ValuesTypes } from './const'
import { genStyleFromValues } from './genStyleFromValues'
import { genValuesFromTransform } from './genValuesFromTransform'
export { useEffectAsync } from './useEffectAsync'

const isBrowser =
  typeof window !== 'undefined' &&
  typeof document !== 'undefined' &&
  typeof document.createElement === 'function'

type IdMap<T extends string> = Record<T, { N: T }>
type ClientIdMap<T extends string> = Record<T, { N: T; E: () => HTMLElement }>
type MotionSource<T extends string> = readonly T[] | IdMap<T>
type ResolveResult<T extends string> = { idMap: IdMap<T>; names: readonly T[] }

export const createId = <T extends string>(names: readonly T[]): IdMap<T> => {
  if (names.length !== new Set(names).size) {
    throw new Error('Duplicate names are not allowed')
  }
  return names.reduce((acc, name) => {
    acc[name] = { N: name }
    return acc
  }, {} as IdMap<T>)
}

export const createMotion = <T extends string>(source: MotionSource<T>) => {
  type TargetTypes = (HTMLElement | Element) | T

  const { idMap: serverSafeIds, names } = __resolveIds(source)
  const ID = names.reduce((acc, name) => {
    let cachedElement: HTMLElement | null = null
    acc[name] = {
      E: () => {
        // RSC（サーバ環境）では利用できない
        if (!isBrowser) {
          throw new Error('E()はクライアント専用です')
        }
        if (!cachedElement) {
          const el = document.getElementById(name as string)
          if (el) {
            cachedElement = el
          } else {
            throw new Error(`Element not found: ${name}`)
          }
        }
        return cachedElement
      },
      N: serverSafeIds[name].N,
    }
    return acc
  }, {} as ClientIdMap<T>)

  const getElement = (target: TargetTypes) => {
    return typeof target == 'string' ? ID[target].E() : (target as HTMLElement)
  }
  const motion = {
    run: <T>(task: () => Promise<T>): Promise<T> => {
      if (!isBrowser) {
        throw new Error('motionの関数はクライアント専用です')
      }
      return task()
    },
    delay: (duration: number): Promise<void> => {
      // RSC（サーバ環境）では利用できない
      if (!isBrowser) {
        throw new Error('motionの関数はクライアント専用です')
      }
      return new Promise((resolve): void => {
        setTimeout(resolve, duration * 1000)
      })
    },
    get: (target: TargetTypes, property: keyof CssTypes) => {
      // RSC（サーバ環境）では利用できない
      if (!isBrowser) {
        throw new Error('motionの関数はクライアント専用です')
      }
      const el = getElement(target)
      return window.getComputedStyle(el)[property as any]
    },
    repeat: (
      target: TargetTypes,
      duration: number,
      values: ValuesTypes
    ): { pause: () => void; play: () => void; stop: () => void; destroy: () => void } => {
      // RSC（サーバ環境）では利用できない
      if (!isBrowser) {
        throw new Error('motionの関数はクライアント専用です')
      }
      const el = getElement(target)
      const includesTransform = Object.keys(values).some((p) =>
        TRANSFORM_PROPERTIES.includes(p)
      )

      // after（適用するスタイル）を生成
      const after: CssTypes = (() => {
        const style: CssTypes = {}
        // 非transform系はそのまま入れる（genStyleFromValuesはtransform:''を含み得るため回避）
        Object.keys(values).forEach((k) => {
          if (!TRANSFORM_PROPERTIES.includes(k)) {
            const prop = k as keyof ValuesTypes
            Object.assign(style, { [prop]: values[prop] })
          }
        })
        // transformを変更する場合のみ、元transformを基準に合成してセットする
        if (includesTransform) {
          const originalTransformValues = genValuesFromTransform(el.style.transform)
          const merged = Object.assign({}, originalTransformValues, values)
          Object.assign(style, { transform: genStyleFromValues(merged).transform })
        }
        return Object.assign(style, {
          transitionDuration: `${duration}s`,
          transitionTimingFunction: 'linear',
        })
      })()

      const state = {
        after,
        before: {} as Partial<Record<keyof CSSStyleDeclaration, string>>,
        stop: false,
        running: false,
        timeoutId: null as number | null,
        rafId: null as number | null,
      }

      // repeatが実際に触るキーだけ保存する（afterのキー + メタプロパティ）
      Object.keys(after).forEach((k) => {
        const prop = k as keyof CSSStyleDeclaration
        Object.assign(state.before, { [prop]: el.style[prop] })
      })

      const cancel = () => {
        if (state.timeoutId !== null) {
          clearTimeout(state.timeoutId)
          state.timeoutId = null
        }
        if (state.rafId !== null) {
          cancelAnimationFrame(state.rafId)
          state.rafId = null
        }
      }

      const tick = () => {
        if (state.stop) {
          state.running = false
          return
        }
        Object.assign(el.style, state.before)
        state.rafId = requestAnimationFrame(() => {
          state.rafId = null
          if (state.stop) {
            state.running = false
            return
          }
          Object.assign(el.style, state.after)
          state.timeoutId = window.setTimeout(() => {
            state.timeoutId = null
            state.rafId = requestAnimationFrame(() => {
              state.rafId = null
              tick()
            })
          }, duration * 1000)
        })
      }

      const stopImpl = (restore: boolean) => {
        state.stop = true
        state.running = false
        cancel()
        if (restore) Object.assign(el.style, state.before)
      }

      const play = () => {
        if (state.running) return
        state.stop = false
        state.running = true
        cancel()
        tick()
      }

      // 初回開始
      play()

      return {
        pause: () => stopImpl(false),
        play,
        stop: () => stopImpl(true),
        destroy: () => stopImpl(true),
      }
    },
    set: (target: TargetTypes, values: ValuesTypes): void => {
      // RSC（サーバ環境）では利用できない
      if (!isBrowser) {
        throw new Error('motionの関数はクライアント専用です')
      }
      const el = getElement(target)
      const originalValues = genValuesFromTransform(el.style.transform)
      const style = genStyleFromValues(Object.assign(originalValues, values))
      if (values.transitionDuration === undefined) {
        Object.assign(style, { transitionDuration: '0s' })
      }
      Object.assign(el.style, style)
    },
    to: async (
      target: TargetTypes,
      duration: number,
      easing: 'in' | 'out' | 'inout' | 'bounce' | 'linear',
      values: ValuesTypes,
      options?: { signal?: AbortSignal }
    ) => {
      // RSC（サーバ環境）では利用できない
      if (!isBrowser) {
        throw new Error('motionの関数はクライアント専用です')
      }
      const el = getElement(target)
      const originalValues = genValuesFromTransform(el.style.transform)
      const style = genStyleFromValues(Object.assign(originalValues, values))
      Object.assign(style, {
        transitionDuration: `${duration}s`,
        transitionTimingFunction:
          easing === 'bounce'
            ? BEZIER.bounce
            : easing === 'linear'
            ? 'linear'
            : BEZIER.expo[easing],
      })
      // ブラウザ側のキャッシュをパージする
      let includedTransform = false
      Object.keys(values).forEach((p) => {
        if (TRANSFORM_PROPERTIES.includes(p)) includedTransform = true
        window.getComputedStyle(el).getPropertyValue(p)
      })
      if (includedTransform)
        window.getComputedStyle(el).getPropertyValue('transform')
      requestAnimationFrame(async () => {
        Object.assign(el.style, style)
      })
      const signal = options?.signal
      if (signal?.aborted) return
      if (!signal) {
        await motion.delay(duration)
        return
      }
      await new Promise<void>((resolve) => {
        const onAbort = () => {
          signal.removeEventListener('abort', onAbort)
          resolve()
        }
        signal.addEventListener('abort', onAbort, { once: true })
        motion.delay(duration).then(() => {
          signal.removeEventListener('abort', onAbort)
          resolve()
        })
      })
    },
  }

  return { ID, motion }
}

function __resolveIds<T extends string>(source: MotionSource<T>): ResolveResult<T> {
  if (Array.isArray(source)) {
    return { idMap: createId(source), names: source }
  }
  const map = source as IdMap<T>
  return { idMap: map, names: Object.keys(map) as unknown as readonly T[] }
}
