import { TweenMax } from 'gsap'

const set = (
  element: Element | Element[] | HTMLCollection,
  values: any
): void => {
  TweenMax.set(element, values)
}

export default set
