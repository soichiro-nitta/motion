import { BEZIER, CssTypes, TRANSFORM_PROPERTIES, ValuesTypes } from './const'
import { genStyleFromValues } from './genStyleFromValues'
import { genValuesFromTransform } from './genValuesFromTransform'
export { useEffectAsync } from './useEffectAsync'
export const runAsync = <T>(task: () => Promise<T>): Promise<T> => task()

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
    ): { pause: () => void; play: () => void } => {
      // RSC（サーバ環境）では利用できない
      if (!isBrowser) {
        throw new Error('motionの関数はクライアント専用です')
      }
      const el = getElement(target)
      const originalValues = genValuesFromTransform(el.style.transform)
      const state = {
        after: Object.assign(
          genStyleFromValues(Object.assign(originalValues, values)),
          {
            transitionDuration: `${duration}s`,
            transitionTimingFunction: 'linear',
          }
        ),
        before: {},
        stop: false,
      }
      Object.keys(state.after).forEach((k) => {
        const prop = k as keyof CSSStyleDeclaration
        Object.assign(state.before, { [prop]: el.style[prop] })
      })
      const anim = () => {
        if (!state.stop) {
          Object.assign(el.style, state.before)
          requestAnimationFrame(() => {
            Object.assign(el.style, state.after)
          })
          setTimeout(() => {
            requestAnimationFrame(() => {
              anim()
            })
          }, duration * 1000)
        }
      }
      anim()
      return {
        pause: () => {
          state.stop = true
        },
        play: () => {
          state.stop = false
          anim()
        },
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
      values: ValuesTypes
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
      await motion.delay(duration)
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
