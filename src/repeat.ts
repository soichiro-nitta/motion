import { assign } from './lib/assign'
import { genStyleFromValues } from './lib/genStyleFromValues'
import { genValuesFromTransform } from './lib/genValuesFromTransform'
import { keys } from './lib/keys'
import { ElementTypes, ValuesTypes } from './types'

const repeat = (
  element: ElementTypes,
  duration: number,
  values: ValuesTypes
): { pause: () => void; play: () => void } => {
  const e = element as HTMLElement
  const originalValues = genValuesFromTransform(e.style.transform)
  const state = {
    after: assign(genStyleFromValues(assign(originalValues, values)), {
      transitionDuration: `${duration}s`,
      transitionTimingFunction: 'linear',
    }),
    before: {},
    stop: false,
  }
  keys(state.after).forEach((key) => {
    const prop = key as keyof CSSStyleDeclaration
    assign(state.before, { [prop]: e.style[prop] })
  })

  const anim = () => {
    if (!state.stop) {
      assign(e.style, state.before)
      requestAnimationFrame(() => {
        assign(e.style, state.after)
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

export default repeat
