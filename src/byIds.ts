import { motion } from '.'
import { ElementTypes } from './types'

const getElement = <T>(name: T) => {
  const el = document.getElementById(name as string)
  if (el) return el
  throw new Error(`Element not found: ${name}`)
}

const idObject = <T>(name: T) => {
  let cachedElement: HTMLElement | null = null
  return {
    E: () => {
      if (!cachedElement) cachedElement = getElement(name)
      return cachedElement
    },
    N: name,
  }
}

const addType = <T>() => {
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

const byIds = <T extends string>(names: T[]) => {
  if (names.length !== new Set(names).size) {
    throw new Error('Duplicate names are not allowed')
  }
  const ID = names.reduce((acc, name) => {
    acc[name] = idObject<T>(name)
    return acc
  }, {} as Record<T, ReturnType<typeof idObject>>)
  return {
    ID,
    motion: addType<T>(),
  }
}

export default byIds
