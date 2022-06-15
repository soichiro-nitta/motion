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
  element: ElementTypes,
  duration: number,
  easing: 'in' | 'out' | 'inout',
  values: ValuesTypes
) => {
  const e = element as HTMLElement
  const originalValues = genValuesFromTransform(e.style.transform)
  const style = genStyleFromValues(assign(originalValues, values))

  assign(style, {
    transitionDuration: `${duration}s`,
    transitionTimingFunction: bezier.expo[easing],
  })

  // ブラウザ側のキャッシュをパージする
  let includedTransform = false
  Object.keys(values).forEach((p) => {
    if (transformProperties.includes(p)) includedTransform = true
    window.getComputedStyle(element).getPropertyValue(p)
  })
  if (includedTransform) {
    console.log('transformのパージ')
    window.getComputedStyle(element).getPropertyValue('transform')
  }

  requestAnimationFrame(async () => {
    assign(e.style, style)
  })
  await delay(duration)
}

export default to
