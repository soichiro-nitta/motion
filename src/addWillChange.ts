import { ElementTypes } from './types'

const addWillChange = (element: ElementTypes, willChange: string): void => {
  const e = element as HTMLElement
  e.style.willChange = willChange
}

export default addWillChange
