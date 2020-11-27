export const assign = (
  o1: Record<string, any>,
  o2: Record<string, any>
): Record<string, any> => {
  return Object.assign(o1, o2)
}
