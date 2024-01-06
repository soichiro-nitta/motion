import {
  BEZIER,
  CssTypes,
  ElementTypes,
  TRANSFORM_PROPERTIES,
  ValuesTypes,
} from './const'
import { genStyleFromValues } from './genStyleFromValues'
import { genValuesFromTransform } from './genValuesFromTransform'

export const motion = {
  delay: (duration: number): Promise<void> => {
    return new Promise((resolve): void => {
      setTimeout(resolve, duration * 1000)
    })
  },
  get: (element: ElementTypes, property: keyof CssTypes) => {
    const e = element as HTMLElement
    return window.getComputedStyle(e)[property as any]
  },
  repeat: (
    element: ElementTypes,
    duration: number,
    values: ValuesTypes
  ): { pause: () => void; play: () => void } => {
    const e = element as HTMLElement
    const originalValues = genValuesFromTransform(e.style.transform)
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
      Object.assign(state.before, { [prop]: e.style[prop] })
    })
    const anim = () => {
      if (!state.stop) {
        Object.assign(e.style, state.before)
        requestAnimationFrame(() => {
          Object.assign(e.style, state.after)
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
  set: (element: ElementTypes, values: ValuesTypes): void => {
    const e = element as HTMLElement
    const originalValues = genValuesFromTransform(e.style.transform)
    const style = genStyleFromValues(Object.assign(originalValues, values))
    Object.assign(e.style, style)
  },
  to: async (
    element: string | ElementTypes,
    duration: number,
    easing: 'in' | 'out' | 'inout' | 'bounce',
    values: ValuesTypes
  ) => {
    // const e =
    //   typeof element === 'string'
    //     ? id([element]).ID[element].E()
    //     : (element as HTMLElement)
    const e = element as HTMLElement
    const originalValues = genValuesFromTransform(e.style.transform)
    const style = genStyleFromValues(Object.assign(originalValues, values))
    Object.assign(style, {
      transitionDuration: `${duration}s`,
      transitionTimingFunction:
        easing === 'bounce' ? BEZIER.bounce : BEZIER.expo[easing],
    })
    // ブラウザ側のキャッシュをパージする
    let includedTransform = false
    Object.keys(values).forEach((p) => {
      if (TRANSFORM_PROPERTIES.includes(p)) includedTransform = true
      window.getComputedStyle(e).getPropertyValue(p)
    })
    if (includedTransform)
      window.getComputedStyle(e).getPropertyValue('transform')
    requestAnimationFrame(async () => {
      Object.assign(e.style, style)
    })
    await motion.delay(duration)
  },
}
export const byIds = <T extends string>(names: T[]) => {
  if (names.length !== new Set(names).size) {
    throw new Error('Duplicate names are not allowed')
  }
  const idObj = <T>(name: T) => {
    let cachedElement: HTMLElement | null = null
    return {
      E: () => {
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
      N: name,
    }
  }
  const ID = names.reduce((acc, name) => {
    acc[name] = idObj<T>(name)
    return acc
  }, {} as Record<T, ReturnType<typeof idObj>>)
  return {
    ID,
    motion: motion as Omit<typeof motion, 'to'> & {
      to: (
        ...args: [
          T | ElementTypes,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(Parameters<typeof motion.to> extends [any, ...infer U]
            ? U
            : never)
        ]
      ) => void
    },
  }
}
