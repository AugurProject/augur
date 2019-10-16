'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import insertKeyframesRule from 'domkit/insertKeyframesRule'
import appendVendorPrefix from 'domkit/appendVendorPrefix'

const keyframes = {
  '100%': {
    transform: 'rotate(360deg)'
  }
}

const animationName = insertKeyframesRule(keyframes)

function getBallStyle (_size) {
  return {
    width: _size,
    height: _size,
    borderRadius: '100%'
  }
}

function getAnimationStyle () {
  return {
    animation: [animationName, '0.8s', '0s', 'infinite', 'linear'].join(' '),
    animationFillMode: 'forwards'
  }
}

function getStyle (size, color, idx) {
  const _size = parseInt(size)
  const moonSize = _size / 7

  switch (idx) {
    case 1:
      return appendVendorPrefix(
        Object.assign(getBallStyle(moonSize), getAnimationStyle(), {
          backgroundColor: color,
          opacity: '0.8',
          position: 'absolute',
          top: _size / 2 - moonSize / 2
        })
      )
    case 2:
      return appendVendorPrefix(
        Object.assign(getBallStyle(_size), {
          border: moonSize + 'px solid ' + color,
          opacity: 0.1
        })
      )
    default:
      return appendVendorPrefix(
        Object.assign(getAnimationStyle(), {
          position: 'relative'
        })
      )
  }
}

function MoonLoader ({ className, color, size }) {
  const styles = [0, 1, 2].map(getStyle.bind(null, size, color))

  return (
    <div className={className}>
      <div style={styles[0]}>
        <div style={styles[1]} />
        <div style={styles[2]} />
      </div>
    </div>
  )
}

MoonLoader.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string
}

MoonLoader.defaultProps = {
  color: '#ffffff',
  size: '60px'
}

export default MoonLoader
