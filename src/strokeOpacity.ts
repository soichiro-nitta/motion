import { TweenMax, Expo } from 'gsap'

const strokeOpacity = (
  element: Element | HTMLCollection,
  value: number,
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
      strokeOpacity: value,
      ease
    })
  })
}

export default strokeOpacity
