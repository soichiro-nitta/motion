import { CssTypes, ValuesTypes } from '~/types'
import { assign } from './assign'
import { specific } from './specific'

export const genStyleFromValues = (values: ValuesTypes): CssTypes => {
  const style: CssTypes = {}
  let transform = ''

  Object.keys(values).forEach((key) => {
    const prop = key as keyof ValuesTypes
    const include = specific.includes(prop as string)
    if (include) {
      for (const i of specific) {
        if (i === prop) {
          transform += `${prop}(${values[prop]}) `
        }
      }
      transform = transform.slice(0, -1)
    } else {
      assign(style, { [prop]: values[prop] })
    }
  })

  return assign(style, { transform })
}
