import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const ComponentNav = p => (
  <ul
    className={classNames('component-nav', { 'full-width-nav': p.fullWidth })}
  >
    {Object.keys(p.navItems || {}).map(nav => (
      <button
        key={nav}
        className={classNames('unstyled', { selected: p.selectedNav === nav, 'mobile-only': p.navItems[nav].isMobile })}
        onClick={() => { p.updateSelectedNav(nav) }}
      >
        <li className={classNames({ selected: p.selectedNav === nav })} >
          {p.navItems[nav].label}
        </li>
      </button>
    ))}
  </ul>
)

ComponentNav.propTypes = {
  fullWidth: PropTypes.bool,
  navItems: PropTypes.object.isRequired,
  selectedNav: PropTypes.string.isRequired,
  updateSelectedNav: PropTypes.func.isRequired,
}

export default ComponentNav
