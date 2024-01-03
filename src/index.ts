import _createId from './createId'
import delay from './delay'
import get from './get'
import repeat from './repeat'
import set from './set'
import to from './to'
import { ElementTypes } from './types'
import _useMotion from './useMotion'

export const motion = {
  delay,
  get,
  repeat,
  set,
  to,
}

export const useMotion = _useMotion
export const createId = _createId

export const addTypeByIds = <T = string>() => {
  return motion as Omit<typeof motion, 'to'> & {
    to: (
      ...args: [
        T | ElementTypes,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(Parameters<typeof motion.to> extends [any, ...infer U] ? U : never)
      ]
    ) => void
  }
}
