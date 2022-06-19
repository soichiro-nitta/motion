import { CssTypes, ElementTypes } from './types'

const get = (element: ElementTypes, property: keyof CssTypes) => {
  const e = element as HTMLElement
  return window.getComputedStyle(e)[property as any]
}

export default get
