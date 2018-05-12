import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { mobileMenuStates } from 'modules/app/components/app/app'

import Styles from 'modules/app/components/inner-nav/inner-nav.styles'
import { isNull } from 'lodash'
import MenuItem from 'modules/app/components/inner-nav/menu-item'

const BaseInnerNavPure = ({ isMobile, menuItems=[], submenuItems=[], subMenuScalar, mobileMenuState }) => {
  const showMainMenu = mobileMenuState >= mobileMenuStates.FIRSTMENU_OPEN
  const showSubMenu = mobileMenuState === mobileMenuStates.SUBMENU_OPEN

  let subMenuAnimatedStyle
  if (!isMobile) {
    subMenuAnimatedStyle = { left: (110 * subMenuScalar) }
  }

  const DataToItem = item => (
    <MenuItem
      isSelected={item.isSelected}
      visible={item.visible}
    >
      {item.link &&
      <Link
        to={item.link}
        onClick={item.onClick}
      >
        {item.label}
      </Link>
      }
      {!item.link &&
      <button onClick={item.onClick}>
        {item.label}
      </button>
      }
    </MenuItem>
  )
  return (
    <aside
      className={classNames(
        Styles.InnerNav,
        { [Styles.mobileShow]: showMainMenu },
      )}
    >
      <ul
        className={classNames(
          Styles.InnerNav__menu,
          Styles['InnerNav__menu--submenu'],
          { [Styles['InnerNav__menu--submenu--mobileshow']]: showSubMenu },
        )}
        style={subMenuAnimatedStyle}
      >
        {(submenuItems.filter(item => !isNull(item.label))).map(item => <DataToItem key={item.label} {...item} />)}
      </ul>
      <ul
        className={classNames(Styles.InnerNav__menu, Styles['InnerNav__menu--main'])}
      >
        {menuItems.map(item => <DataToItem key={item.label} {...item} />)}
      </ul>
    </aside>
  )
}

BaseInnerNavPure.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  mobileMenuState: PropTypes.number.isRequired,
  subMenuScalar: PropTypes.number.isRequired,
  menuItems: PropTypes.array.isRequired,
  submenuItems: PropTypes.array.isRequired,
}

export default BaseInnerNavPure

