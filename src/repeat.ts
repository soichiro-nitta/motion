import { ElementTypes, ValuesTypes } from './types'
import { genStyleFromValues } from './lib/genStyleFromValues'
import { assign } from './lib/assign'

let stop = false

const repeat = (
  element: ElementTypes,
  duration: number,
  values: ValuesTypes
): { pause: () => void; play: () => void } => {
  const before = element.style
  const after = genStyleFromValues(values)

  assign(element.style, before)

  assign(after, { transitionDuration: `${duration}s` })
  assign(element.style, after)

  if (!stop) {
    setTimeout(() => {
      requestAnimationFrame(() => {
        repeat(element, duration, values)
      })
    }, duration * 1000)
  }

  const pause = () => {
    stop = true
  }

  const play = () => {
    stop = false
    requestAnimationFrame(() => {
      repeat(element, duration, values)
    })
  }

  return { pause, play }
}

export default repeat
