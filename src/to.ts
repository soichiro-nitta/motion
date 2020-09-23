import { TweenMax, Linear } from 'gsap'

const to = (
  element: Element | Element[] | HTMLCollection,
  duration: number,
  values: any
): any => {
  let animation
  const newValues = Object.assign(values, { ease: Linear.easeNone })
  requestAnimationFrame(() => {
    animation = TweenMax.to(element, duration, newValues)
  })
  return animation
}

export default to
