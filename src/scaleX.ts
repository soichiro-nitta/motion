import { TweenMax, Expo } from 'gsap'

const scaleX = (
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
  TweenMax.to(element, duration, {
    scaleX: value,
    ease
  })
}

export default scaleX
