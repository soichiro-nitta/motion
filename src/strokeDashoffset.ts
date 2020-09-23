import { TweenMax, Expo } from 'gsap'

const strokeDashoffset = (
  element: Element | HTMLCollection,
  value: number | string,
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
      strokeDashoffset: value,
      ease
    })
  })
}

export default strokeDashoffset
