import React from 'react'
import PropTypes from 'prop-types'

import Styles from './single-slice-pie-graph.styles'

export default function SingleSlicePieGraph({ radius = 45, percentage }) {
  const arcLength = (2 * Math.PI) * percentage

  const x = (Math.cos(arcLength) * radius) + radius
  const y = (Math.sin(arcLength) * radius) + radius


  const flags = (percentage > 0.5 ? '0 0, 0' : '1 1, 0')
  const path = `M${radius}, ${radius} L${2 * radius}, ${radius} A${radius} ${radius}, ${flags}, ${x} ${y} Z`
  return (
    <svg viewBox="0 0 120 120" className={Styles.SingleSlicePieGraph}>
      <g transform="translate(15,15)">
        <circle cx={radius} cy={radius} r={radius} />
        <path
          d={path}
        />
      </g>
    </svg>
  )
}

SingleSlicePieGraph.propTypes = {
  radius: PropTypes.number,
  percentage: PropTypes.number.isRequired,
}
