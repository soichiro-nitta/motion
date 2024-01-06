import { Properties } from 'csstype'

export const BEZIER = {
  bounce: 'cubic-bezier(0.4, 2, 0.1, 0.8)',
  expo: {
    in: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
    inout: 'cubic-bezier(1, 0, 0, 1)',
    out: 'cubic-bezier(0.19, 1, 0.22, 1)',
  },
}

export const TRANSFORM_PROPERTIES = [
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'translateX',
  'translateY',
  'translateZ',
]

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
