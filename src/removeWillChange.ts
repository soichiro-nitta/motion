import { ElementTypes } from './types'

const removeWillChange = (element: ElementTypes): void => {
  element.style.willChange = 'auto'
}

export default removeWillChange
