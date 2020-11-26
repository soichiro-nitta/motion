import { Properties } from 'csstype'

export type SpecificTypes = {
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

export type CssTypes = Properties

export type ElementTypes = HTMLElement

export type ValuesTypes = CssTypes & SpecificTypes
