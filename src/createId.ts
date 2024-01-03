const getElement = (name: string) => {
  const el = document.getElementById(name)
  if (el) return el
  throw new Error(`Element not found: ${name}`)
}

const idObject = (name: string) => {
  let cachedElement: HTMLElement | null = null
  return {
    E: () => {
      if (!cachedElement) cachedElement = getElement(name)
      return cachedElement
    },
    N: name,
  }
}

const createId = (names: string[]) => {
  if (names.length !== new Set(names).size) {
    throw new Error('Duplicate names are not allowed')
  }
  const ID = names.reduce((acc, name) => {
    acc[name] = idObject(name)
    return acc
  }, {} as Record<string, ReturnType<typeof createIdObject>>)
  return { ID }
}
export default createId
