import { assign } from './lib/assign'
import { bezier } from './lib/bezier'
import { genStyleFromValues } from './lib/genStyleFromValues'
import { genValuesFromTransform } from './lib/genValuesFromTransform'
import { ElementTypes, ValuesTypes } from './types'

const to = (
  element: ElementTypes,
  duration: number,
  easing: 'in' | 'out' | 'inout',
  values: ValuesTypes
): void => {
  const e = element as HTMLElement
  const originalValues = genValuesFromTransform(e.style.transform)
  const style = genStyleFromValues(assign(originalValues, values))

  assign(style, {
    transitionDuration: `${duration}s`,
    transitionTimingFunction: bezier.expo[easing],
  })

  requestAnimationFrame(() => {
    assign(e.style, style)
  })
}

export default to
