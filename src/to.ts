import { TweenMax } from 'gsap'

const to = (
  element: Element | Element[] | HTMLCollection,
  duration: number,
  values: any
): any => {
  let animation
  requestAnimationFrame(() => {
    animation = TweenMax.to(element, duration, values)
  })
  return animation
}

export default to
