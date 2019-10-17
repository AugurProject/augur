'use strict'

export function throttleEvent (type, name, obj) {
  obj = obj || window
  const func = throttleFunc(() => obj.dispatchEvent(new CustomEvent(name)))
  obj.addEventListener(type, func)
}

export function throttleFunc (cb) {
  let running = false
  function wrapped (...args) {
    if (!running) {
      requestAnimationFrame(function () {
        // eslint-disable-next-line standard/no-callback-literal
        cb(...args)
        running = false
      })
      running = true
    }
  }
  return wrapped
}
