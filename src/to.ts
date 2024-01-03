import id from './createId'
import delay from './delay'
import { assign } from './lib/assign'
import { bezier } from './lib/bezier'
import { genStyleFromValues } from './lib/genStyleFromValues'
import { genValuesFromTransform } from './lib/genValuesFromTransform'
import { ElementTypes, ValuesTypes } from './types'

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
  const e =
    typeof element === 'string'
      ? id([element]).ID[element].E()
      : (element as HTMLElement)
  const originalValues = genValuesFromTransform(e.style.transform)
  const style = genStyleFromValues(assign(originalValues, values))

  assign(style, {
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
    assign(e.style, style)
  })
  await delay(duration)
}

export default to
