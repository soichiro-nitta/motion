import { CssTypes, ValuesTypes } from '~/types'

import { keys } from './keys'
import { specific } from './specific'

export const genStyleFromValues = (values: ValuesTypes): CssTypes => {
  const style: CssTypes = {}
  let transform = ''

  keys(values).forEach((key) => {
    const prop = key as keyof ValuesTypes
    const include = specific.includes(prop as string)
    if (include) {
      transform += `${prop}(${values[prop]}) `
    } else {
      Object.assign(style, { [prop]: values[prop] })
    }
  })
  transform = transform.slice(0, -1)

  return Object.assign(style, { transform })
}
