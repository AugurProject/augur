import React from 'react'
import PropTypes from 'prop-types'

import Styles from './single-slice-pie-graph.styles'

export default function SingleSlicePieGraph({ percentage, backgroundColor = 'white' }) {
  const degree = ((180 - (360 * percentage)) - 90)
  const purple = '#412468' // @color-purple
  const color1 = (percentage > 0.5) ? purple : 'transparent'
  const color2 = (percentage > 0.5) ? 'transparent' : backgroundColor

  const CircleStyling = {
    backgroundImage: `
      linear-gradient(${degree}deg, ${color1} 50%, ${color2} 50%),
      linear-gradient(90deg, transparent 50%, ${purple} 50%)
    `,
    backgroundColor: `${backgroundColor}`,
  }

  return (
    <div
      className={Styles.SingleSlicePieGraph}
      style={CircleStyling}
    />
  )
}

SingleSlicePieGraph.propTypes = {
  percentage: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string,
}
