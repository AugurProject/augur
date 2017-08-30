export default function (item) {
  return (typeof item === 'object' && !Array.isArray(item) && item !== null)
}
