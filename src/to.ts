import { TweenMax, Linear } from 'gsap'

const to = (
  element: Element | Element[] | HTMLCollection,
  duration: number,
  values: any
): any => {
  const newValues = Object.assign(values, { ease: Linear.easeNone })
  return TweenMax.to(element, duration, newValues)
}

export default to
