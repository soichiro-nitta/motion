import { ElementTypes } from './types'

const removeWillChange = (element: ElementTypes): void => {
  element.style.willChange = ''
}

export default removeWillChange
