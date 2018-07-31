import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const NavAccountIcon = p => (
  <svg
    viewBox="0 0 24 24"
    className={classNames('nav-account-icon', { [p.className]: p.className })}
  >
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
      <g id="Icon/Accout" stroke="#FFFFFF">
        <g id="Page-1" transform="translate(5.000000, 1.000000)">
          <path d="M13.341625,18.1445846 C13.341625,17.1418923 13.341625,15.8667385 13.3407656,15.2456615 C13.3399062,14.1879692 13.0056094,13.2453538 12.3120937,12.4347385 C11.4724844,11.4548923 10.4025625,10.9108154 9.09889063,10.8659692 C8.47584375,10.8448154 7.56920313,10.8431231 6.76225,10.8465077" id="Stroke-1" />
          <path d="M0.43003125,18.1445846 L0.43003125,15.2456615 C0.43175,14.1879692 0.7651875,13.2453538 1.4595625,12.4347385 C2.2983125,11.4548923 3.36823438,10.9108154 4.67276563,10.8659692 C5.29495313,10.8448154 6.20245313,10.8431231 7.00940625,10.8465077" id="Stroke-3" />
          <polyline id="Stroke-5" points="13.2384141 18.2255615 6.92286719 21.6127154 0.468101563 18.2255615" />
          <path d="M10.8667109,4.39543077 C10.8667109,2.20135385 9.06030469,0.422738462 6.83280469,0.422738462 C4.60444531,0.422738462 2.79803906,2.20135385 2.79803906,4.39543077 C2.79803906,6.58866154 4.60444531,8.36727692 6.83280469,8.36727692 C9.06030469,8.36727692 10.8667109,6.58866154 10.8667109,4.39543077 Z" id="Stroke-7" />
        </g>
      </g>
    </g>
  </svg>
)

export default NavAccountIcon

NavAccountIcon.propTypes = {
  className: PropTypes.string,
}
