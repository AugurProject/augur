import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const MobileNavHamburgerIcon = p => (
  <svg
    viewBox="0 0 16 12"
    className={classNames('mobile-nav-hamburger-icon', { [p.className]: p.className })}
  >
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
      <g id="Nav/Header" transform="translate(-16.000000, -18.000000)" stroke="#FFFFFF">
        <g id="Icon/Mobile/Menu" transform="translate(16.000000, 16.000000)">
          <g id="Group" transform="translate(0.666667, 2.000000)">
            <path d="M0,6 L14.6676925,6" id="MobileNavHamburgerIconLine1" />
            <path d="M0,11.3333333 L14.6676925,11.3333333" id="MobileNavHamburgerIconLine2" />
            <path d="M0,0.666666667 L14.6676925,0.666666667" id="MobileNavHamburgerIconLine3" />
          </g>
        </g>
      </g>
    </g>
  </svg>
)

export default MobileNavHamburgerIcon

MobileNavHamburgerIcon.propTypes = {
  className: PropTypes.string,
}
