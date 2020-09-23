import { TweenMax, Expo } from 'gsap'

const y = (
  element: Element | Element[] | HTMLCollection,
  value: string | number,
  duration: number,
  easing: 'In' | 'Out' | 'InOut'
): void => {
  let ease: Expo
  switch (easing) {
    case 'In':
      ease = Expo.easeIn
      break
    case 'Out':
      ease = Expo.easeOut
      break
    case 'InOut':
      ease = Expo.easeInOut
      break
  }
  requestAnimationFrame(() => {
    TweenMax.to(element, duration, {
      y: value,
      ease
    })
  })
}

export default y
