import { DependencyList, useEffect } from 'react'

type Cleanup = () => void
type AsyncEffect = (onCleanup: (cleanup: Cleanup) => void) => void | Promise<void>

export const useEffectAsync = (effect: AsyncEffect, deps: DependencyList) => {
  useEffect(() => {
    const cleanups: Cleanup[] = []
    let disposed = false

    const onCleanup = (cleanup: Cleanup) => {
      if (disposed) {
        cleanup()
        return
      }
      cleanups.push(cleanup)
    }

    void effect(onCleanup)

    return () => {
      disposed = true
      cleanups.splice(0).reverse().forEach((cleanup) => cleanup())
    }
  }, deps)
}
