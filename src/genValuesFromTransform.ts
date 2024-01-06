import { ValuesTypes } from './const'

export const genValuesFromTransform = (transform: string): ValuesTypes => {
  const values = {} as ValuesTypes

  transform.split(' ').forEach((value) => {
    // 括弧より前の文字列
    const key = value.replace(/\(.+?\)/, '')
    // 括弧の中身の文字列
    const val = value.match(/\(([^)]+)\)/)?.[1]

    if (key && val) Object.assign(values, { [key]: val })
  })

  return values
}
