import { DependencyList, useEffect } from 'react'

type AsyncEffect = () => void | (() => void) | Promise<void | (() => void)>

export const useEffectAsync = (effect: AsyncEffect, deps: DependencyList) => {
  useEffect(() => {
    let cleanup: void | (() => void)
    let cancelled = false
    const assignCleanup = (result: void | (() => void) | undefined) => {
      if (typeof result === 'function') {
        if (cancelled) {
          result()
        } else {
          cleanup = result
        }
      }
    }
    const result = effect()
    if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
      void (result as Promise<void | (() => void)>).then((resolved) => {
        if (!cancelled) assignCleanup(resolved)
        else if (typeof resolved === 'function') resolved()
      })
    } else {
      assignCleanup(result as void | (() => void))
    }
    return () => {
      cancelled = true
      if (typeof cleanup === 'function') cleanup()
    }
  }, deps)
}
