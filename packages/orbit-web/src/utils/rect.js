export function isRectInside (parent, child, options = {}) {
  const { marginTop, marginBottom } = Object.assign({ marginTop: 1, marginBottom: 1 }, options)
  let inside = true
  inside = inside && child.top >= parent.top - marginTop
  inside = inside && child.bottom <= parent.bottom + marginBottom
  return inside
}
