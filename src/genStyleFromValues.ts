import { CssTypes, TRANSFORM_PROPERTIES, ValuesTypes } from './const'

export const genStyleFromValues = (values: ValuesTypes): CssTypes => {
  const style: CssTypes = {}
  let transform = ''

  Object.keys(values).forEach((k) => {
    const prop = k as keyof ValuesTypes
    const include = TRANSFORM_PROPERTIES.includes(prop as string)
    if (include) {
      transform += `${prop}(${values[prop]}) `
    } else {
      Object.assign(style, { [prop]: values[prop] })
    }
  })
  transform = transform.slice(0, -1)

  return Object.assign(style, { transform })
}
