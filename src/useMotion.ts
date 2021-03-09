import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const useMotion = (params: {
  enter: () => Promise<void>
  leave: () => Promise<void>
}): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const { enter, leave } = params
  const [state, setState] = useState<boolean>(false)
  const [motion, setMotion] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      motion ? await enter() : await leave()
      setState(motion)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motion])

  return [state, setMotion]
}

export default useMotion
