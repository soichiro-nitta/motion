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
  const included = {
    bottom: false,
    left: false,
    opacity: false,
    right: false,
    top: false,
    transform: false,
  }
  Object.keys(values).forEach((p) => {
    console.log({ p })
    if (transformProperties.includes(p)) included.transform = true
    if (p === 'opacity') included.opacity = true
    if (p === 'top') included.top = true
    if (p === 'right') included.right = true
    if (p === 'bottom') included.bottom = true
    if (p === 'left') included.left = true
    window.getComputedStyle(element).getPropertyValue(p)
  })
  if (included.transform)
    window.getComputedStyle(element).getPropertyValue('transform')

  let willChange = ''
  Object.keys(included).forEach((p, i) => {
    if (included[p as keyof typeof included])
      willChange += `${i === 0 ? '' : ', '}${p}`
  })
  console.log({ willChange })

  e.style.willChange = willChange
  requestAnimationFrame(async () => {
    assign(e.style, style)
  })
  await delay(duration)
  e.style.willChange = ''
}

export default to
