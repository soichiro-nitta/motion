import { TweenMax, Expo } from 'gsap'

const scale = (
  element: Element | Element[],
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
      scale: value,
      ease
    })
  })
}

export default scale
