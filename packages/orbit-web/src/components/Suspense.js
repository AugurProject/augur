'use strict'

import { useState } from 'react'

import { useTimeout } from '../utils/hooks'

function Suspense (props) {
  const [displayFallback, setDisplayFallback] = useState(false)

  useTimeout(() => {
    setDisplayFallback(true)
    if (props.loading && typeof props.callback === 'function') props.callback()
  }, props.delay)

  return !props.loading
    ? props.children
    : displayFallback
      ? props.fallback
      : props.passThrough
        ? props.children
        : null
}

export default Suspense
