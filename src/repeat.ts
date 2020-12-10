import { ElementTypes, ValuesTypes } from './types'
import { genStyleFromValues } from './lib/genStyleFromValues'
import { assign } from './lib/assign'
import { keys } from './lib/keys'
import { genValuesFromTransform } from './lib/genValuesFromTransform'

const repeat = (
  element: ElementTypes,
  duration: number,
  values: ValuesTypes
): { pause: () => void; play: () => void } => {
  const originalValues = genValuesFromTransform(element.style.transform)
  const state = {
    stop: false,
    before: {},
    after: assign(genStyleFromValues(assign(originalValues, values)), {
      transitionDuration: `${duration}s`,
      transitionTimingFunction: 'linear',
    }),
  }
  keys(state.after).forEach((key) => {
    const prop = key as keyof CSSStyleDeclaration
    assign(state.before, { [prop]: element.style[prop] })
  })

  const anim = () => {
    if (!state.stop) {
      assign(element.style, state.before)
      requestAnimationFrame(() => {
        assign(element.style, state.after)
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
