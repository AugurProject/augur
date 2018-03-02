import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const NavMarketsIcon = p => (
  <svg
    viewBox="0 0 24 24"
    className={classNames('nav-markets-icon', { [p.className]: p.className })}
  >
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
      <g id="Icon/Markets" stroke="#FFFFFF">
        <g id="Page-1" transform="translate(1.000000, 5.000000)">
          <polyline id="Stroke-1" points="0.523704762 13.7305143 7.51132381 5.96660952 13.1663714 9.51594286 21.9286571 0.643657143" />
          <polyline id="Stroke-3" points="15.9004476 0.523809524 21.9829238 0.523809524 21.9829238 6.60628571" />
        </g>
      </g>
    </g>
  </svg>
)

export default NavMarketsIcon

NavMarketsIcon.propTypes = {
  className: PropTypes.string,
}
