import { assign } from './lib/assign'
import { genStyleFromValues } from './lib/genStyleFromValues'
import { genValuesFromTransform } from './lib/genValuesFromTransform'
import { ElementTypes, ValuesTypes } from './types'

const set = (element: ElementTypes, values: ValuesTypes): void => {
  const e = element as HTMLElement
  const originalValues = genValuesFromTransform(e.style.transform)
  const style = genStyleFromValues(assign(originalValues, values))

  assign(e.style, style)
}

export default set
