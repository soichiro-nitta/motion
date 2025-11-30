import { CssTypes, TRANSFORM_ORDER, TRANSFORM_PROPERTIES, ValuesTypes } from './const'

const mapTransformPriority = TRANSFORM_ORDER.reduce((acc, prop, index) => {
  acc[prop] = index
  return acc
}, {} as Record<string, number>)

export const genStyleFromValues = (values: ValuesTypes): CssTypes => {
  const style: CssTypes = {}
  let transform = ''

  Object.keys(values)
    .filter((k) => TRANSFORM_PROPERTIES.includes(k))
    .sort((a, b) => mapTransformPriority[a] - mapTransformPriority[b])
    .forEach((k) => {
      const prop = k as keyof ValuesTypes
      transform += `${prop}(${values[prop]}) `
    })

  Object.keys(values).forEach((k) => {
    const include = TRANSFORM_PROPERTIES.includes(k)
    if (!include) {
      const prop = k as keyof ValuesTypes
      Object.assign(style, { [prop]: values[prop] })
    }
  })

  transform = transform.slice(0, -1)

  return Object.assign(style, { transform })
}
