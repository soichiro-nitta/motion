import { genValuesFromTransform } from './lib/genValuesFromTransform'
import { ElementTypes, ValuesTypes } from './types'
import { bezier } from './lib/bezier'
import { genStyleFromValues } from './lib/genStyleFromValues'
import { assign } from './lib/assign'

const to = (
  element: ElementTypes,
  duration: number,
  easing: 'in' | 'out' | 'inout',
  values: ValuesTypes
): void => {
  const originalValues = genValuesFromTransform(element.style.transform)
  const style = genStyleFromValues(assign(originalValues, values))

  assign(style, {
    transitionDuration: `${duration}s`,
    transitionTimingFunction: bezier.expo[easing],
  })

  requestAnimationFrame(() => {
    assign(element.style, style)
  })
}

export default to
