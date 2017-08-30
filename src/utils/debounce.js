export default function debounce(func, wait) {
  let timeout
  const realWait = wait || 250

  return (...args) => {
    const context = this

    const later = () => {
      timeout = null
      func.apply(context, args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, realWait)
  }
}
