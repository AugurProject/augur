import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const MobileNavBackIcon = p => (
  <svg
    viewBox="0 0 8 14"
    className={classNames('mobile-nav-back-icon', { [p.className]: p.className })}
  >
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
      <g id="Nav/Header-Back" transform="translate(-20.000000, -17.000000)" stroke="#FFFFFF">
        <g id="Icon/back" transform="translate(16.000000, 16.000000)">
          <polyline id="Stroke-3" transform="translate(11.156854, 7.863961) rotate(-135.000000) translate(-11.156854, -7.863961) " points="6.65685425 3.36396103 15.6568542 3.36396103 15.6568542 12.363961" />
        </g>
      </g>
    </g>
  </svg>
)

export default MobileNavBackIcon

MobileNavBackIcon.propTypes = {
  className: PropTypes.string,
}
