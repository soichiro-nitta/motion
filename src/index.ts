import { BEZIER, CssTypes, TRANSFORM_PROPERTIES, ValuesTypes } from './const'
import { genStyleFromValues } from './genStyleFromValues'
import { genValuesFromTransform } from './genValuesFromTransform'

export const createMotion = <T extends string>(names: T[]) => {
  type TargetTypes = (HTMLElement | Element) | T

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
    let cachedElement: HTMLElement | null = null
    acc[name] = {
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
    return acc
  }, {} as Record<T, ReturnType<typeof idObj>>)

  const getElement = (target: TargetTypes) => {
    return typeof target == 'string' ? ID[target].E() : (target as HTMLElement)
  }
  const motion = {
    delay: (duration: number): Promise<void> => {
      return new Promise((resolve): void => {
        setTimeout(resolve, duration * 1000)
      })
    },
    get: (target: TargetTypes, property: keyof CssTypes) => {
      const el = getElement(target)
      return window.getComputedStyle(el)[property as any]
    },
    repeat: (
      target: TargetTypes,
      duration: number,
      values: ValuesTypes
    ): { pause: () => void; play: () => void } => {
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
      const el = getElement(target)
      const originalValues = genValuesFromTransform(el.style.transform)
      const style = genStyleFromValues(Object.assign(originalValues, values))
      Object.assign(el.style, style)
    },
    to: async (
      target: TargetTypes,
      duration: number,
      easing: 'in' | 'out' | 'inout' | 'bounce',
      values: ValuesTypes
    ) => {
      const el = getElement(target)
      const originalValues = genValuesFromTransform(el.style.transform)
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
