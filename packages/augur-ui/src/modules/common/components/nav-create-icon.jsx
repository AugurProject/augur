import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const NavCreateIcon = p => (
  <svg
    viewBox="0 0 24 24"
    className={classNames('nav-create-icon', { [p.className]: p.className })}
  >
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
      <g id="Icon/Create" stroke="#FFFFFF">
        <g id="Page-1" transform="translate(1.165790, 1.165790)">
          <path d="M21.2268659,10.9149851 C21.2268659,5.21980204 16.6102886,0.60202094 10.9151055,0.60202094 C5.21871862,0.60202094 0.602141321,5.21980204 0.602141321,10.9149851 C0.602141321,16.6101682 5.21871862,21.2267455 10.9151055,21.2267455 C16.6102886,21.2267455 21.2268659,16.6101682 21.2268659,10.9149851 Z" id="Stroke-1" />
          <path d="M10.8535913,5.67243126 L10.8535913,16.3778346" id="Stroke-3" />
          <path d="M16.2059318,11.0248922 L5.50052846,11.0248922" id="Stroke-5" />
        </g>
      </g>
    </g>
  </svg>
)

export default NavCreateIcon

NavCreateIcon.propTypes = {
  className: PropTypes.string,
}
