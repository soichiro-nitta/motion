import { ElementTypes } from './types'

const removeWillChange = (element: ElementTypes): void => {
  const e = element as HTMLElement
  e.style.willChange = 'auto'
}

export default removeWillChange
