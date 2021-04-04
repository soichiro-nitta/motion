import { Properties } from 'csstype'

export type CssTypes = Properties

export type ElementTypes = HTMLElement | Element

export type ValuesTypes = CssTypes & {
  rotate?: string
  rotateX?: string
  rotateY?: string
  rotateZ?: string
  scale?: string | number
  scaleX?: string | number
  scaleY?: string | number
  translateX?: string
  translateY?: string
  translateZ?: string
}
