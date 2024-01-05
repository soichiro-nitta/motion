import _byIds from './byIds'
import { bezier } from './lib/bezier'
import { genStyleFromValues } from './lib/genStyleFromValues'
import { genValuesFromTransform } from './lib/genValuesFromTransform'
import { keys } from './lib/keys'
import set from './set'
import { CssTypes, ElementTypes, ValuesTypes } from './types'
import _useMotion from './useMotion'

const delay = (duration: number): Promise<void> => {
  return new Promise((resolve): void => {
    setTimeout(resolve, duration * 1000)
  })
}

const get = (element: ElementTypes, property: keyof CssTypes) => {
  const e = element as HTMLElement
  return window.getComputedStyle(e)[property as any]
}

const repeat = (
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
  keys(state.after).forEach((key) => {
    const prop = key as keyof CSSStyleDeclaration
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
  const pause = () => {
    state.stop = true
  }
  const play = () => {
    state.stop = false
    anim()
  }

  anim()

  return { pause, play }
}

const transformProperties = [
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'translateX',
  'translateY',
  'translateZ',
]

const to = async (
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
      easing === 'bounce'
        ? 'cubic-bezier(0.4, 2, 0.1, 0.8)'
        : bezier.expo[easing],
  })

  // ブラウザ側のキャッシュをパージする
  let includedTransform = false
  Object.keys(values).forEach((p) => {
    if (transformProperties.includes(p)) includedTransform = true
    window.getComputedStyle(e).getPropertyValue(p)
  })
  if (includedTransform)
    window.getComputedStyle(e).getPropertyValue('transform')

  requestAnimationFrame(async () => {
    Object.assign(e.style, style)
  })
  await delay(duration)
}

export const motion = {
  delay,
  get,
  repeat,
  set,
  to,
}

export const useMotion = _useMotion
export const byIds = _byIds
