const getElement = (name: string) => {
  const el = document.getElementById(name)
  if (el) return el
  throw new Error(`Element not found: ${name}`)
}

const createIdObject = (name: string) => {
  let cachedElement: HTMLElement | null = null
  return {
    E: () => {
      if (!cachedElement) cachedElement = getElement(name)
      return cachedElement
    },
    N: name,
  }
}

const id = (names: string[]) => {
  const ID = names.reduce((acc, name) => {
    acc[name] = createIdObject(name)
    return acc
  }, {} as Record<string, ReturnType<typeof createIdObject>>)
  return { ID }
}

export default id
