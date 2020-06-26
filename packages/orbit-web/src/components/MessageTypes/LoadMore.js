'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import debounce from 'lodash.debounce'

function LoadMore ({ parentElement, onActivate, ...rest }) {
  const [t] = useTranslation()
  const lastScrollTop = React.useRef(-1)

  const activate = React.useCallback(() => {
    if (typeof onActivate === 'function') onActivate()
  }, [onActivate])

  const debouncedActivate = React.useCallback(debounce(activate, 100, { loading: true }), [
    activate
  ])

  const onScroll = React.useCallback(
    event => {
      const element = event.target
      if (!element) return
      if (element.scrollTop === 0) {
        debouncedActivate()
      } else if (lastScrollTop.current === 0) {
        debouncedActivate.cancel()
      }
      lastScrollTop.current = element.scrollTop
    },
    [debouncedActivate]
  )

  React.useEffect(() => {
    if (!parentElement) return
    parentElement.addEventListener('scroll', onScroll)
    // Scroll down 1 pixel so the scroll event will fire when scrolling up
    if (parentElement.scrollTop === 0) parentElement.scrollTop = 1
    return () => {
      debouncedActivate.cancel()
      parentElement.removeEventListener('scroll', onScroll)
    }
  }, [parentElement, onScroll])

  return (
    <div className='firstMessage loadMore' {...rest} onClick={activate}>
      {t('channel.loadMore')}
    </div>
  )
}

LoadMore.propTypes = {
  parentElement: PropTypes.instanceOf(Element),
  onActivate: PropTypes.func
}

export default LoadMore
