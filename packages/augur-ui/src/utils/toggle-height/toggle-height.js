export default function (target, isOpen, callback) {
  if (isOpen) {
    const targetTransition = target.style.transition
    target.style.transition = ''

    requestAnimationFrame(() => {
      target.style.height = target.scrollHeight + 'px'
      target.style.transition = targetTransition

      requestAnimationFrame(() => {
        target.style.height = '0px'
      })
    })
  } else {
    target.style.height = target.scrollHeight + 'px'

    target.addEventListener('transitionend', function onTransitionEnd(e) {
      target.removeEventListener('transitionend', onTransitionEnd)
      target.style.height = 'auto'
    })
  }

  callback()
}
