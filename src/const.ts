import { Properties } from 'csstype'

export const BEZIER = {
  bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  expo: {
    in: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
    inout: 'cubic-bezier(1, 0, 0, 1)',
    out: 'cubic-bezier(0.32, 0.72, 0, 1)',
  },
}

export const TRANSFORM_ORDER = [
  'translateY',
  'translateX',
  'translateZ',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
]

export const TRANSFORM_PROPERTIES = [...TRANSFORM_ORDER]

export type CssTypes = Properties

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
