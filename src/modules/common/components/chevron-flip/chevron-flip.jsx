import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import Styles from 'modules/common/components/chevron-flip/chevron-flip.styles'

const ChevronFlip = p => (
  <svg
    className={classNames(
      Styles.ChevronFlip,
      p.className,
      { [Styles.pointDown]: p.pointDown },
    )}
    viewBox="0 0 16 16"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
      <g stroke="#A7A2B2">
        <polyline transform="translate(8.156854, 11.156854) scale(1, -1) rotate(-225.000000) translate(-8.156854, -11.156854) " points="3.65685425 6.65685425 12.6568542 6.65685425 12.6568542 15.6568542" />
      </g>
    </g>
  </svg>
)

ChevronFlip.propTypes = {
  className: PropTypes.string,
  pointDown: PropTypes.bool,
}

export default ChevronFlip
