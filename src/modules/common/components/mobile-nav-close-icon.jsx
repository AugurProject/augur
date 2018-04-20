import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const MobileNavCloseIcon = p => (
  <svg
    viewBox="0 0 16 14"
    className={classNames('mobile-nav-close-icon', { [p.className]: p.className })}
  >
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
      <g id="Nav/Header-Close" transform="translate(-16.000000, -17.000000)" stroke="#F6F6F8">
        <g id="Icon/Close" transform="translate(16.000000, 16.000000)">
          <path d="M1.50624875,1.50624875 L14.4759537,14.4759537" id="MobileNavCloseIconLine" />
          <path d="M14.3030383,1.33333333 L1.33333333,14.3030383 L14.3030383,1.33333333 Z" id="MobileNavCloseIconLineJoinRound" strokeLinejoin="round" />
        </g>
      </g>
    </g>
  </svg>
)

export default MobileNavCloseIcon

MobileNavCloseIcon.propTypes = {
  className: PropTypes.string,
}
