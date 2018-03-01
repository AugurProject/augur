import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Styles from 'modules/app/components/inner-nav/inner-nav.styles'

const MenuItem = p => (
  <li
    className={classNames({
      [Styles['InnerNav__menu-item']]: true,
      [Styles['InnerNav__menu-item--selected']]: p.isSelected,
      [Styles['InnerNav__menu-item--visible']]: p.visible,
    })}
    key={p.key}
  >
    {p.children}
  </li>
)

MenuItem.propTypes = {
  isSelected: PropTypes.bool,
  key: PropTypes.string,
}

export default MenuItem
