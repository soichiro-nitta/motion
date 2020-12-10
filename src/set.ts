import { assign } from './lib/assign'
import { genStyleFromValues } from './lib/genStyleFromValues'
import { genValuesFromTransform } from './lib/genValuesFromTransform'
import { ElementTypes, ValuesTypes } from './types'

const set = (element: ElementTypes, values: ValuesTypes): void => {
  const originalValues = genValuesFromTransform(element.style.transform)
  const style = genStyleFromValues(assign(originalValues, values))

  assign(element.style, style)
}

export default set
