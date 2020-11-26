import { assign } from './lib/assign'
import { genStyleFromValues } from './lib/genStyleFromValues'
import { ElementTypes, ValuesTypes } from './types'

const set = (element: ElementTypes, values: ValuesTypes): void => {
  const style = genStyleFromValues(values)

  assign(element.style, style)
}

export default set
