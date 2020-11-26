export const assign = (
  obj1: Record<string, any>,
  obj2: Record<string, any>
): Record<string, any> => {
  return Object.assign(obj1, obj2)
}
