import { ElementTypes } from './types'

const addWillChange = (element: ElementTypes, willChange: string): void => {
  element.style.willChange = willChange
}

export default addWillChange
