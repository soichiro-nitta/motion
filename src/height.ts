import { TweenMax, Expo } from 'gsap'

const width = (
  element: Element | Element[],
  value: string,
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
    height: value,
    ease
  })
}

export default width
