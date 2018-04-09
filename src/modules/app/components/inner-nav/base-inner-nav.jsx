/* eslint class-methods-use-this: 0 */ // need "blank" class methods to exist to avoid potential crash
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { mobileMenuStates } from 'modules/app/components/app/app'

import Styles from 'modules/app/components/inner-nav/inner-nav.styles'

import MenuItem from 'modules/app/components/inner-nav/menu-item'

export default class BaseInnerNav extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
    mobileMenuState: PropTypes.number.isRequired,
    subMenuScalar: PropTypes.number.isRequired,
  }

  getMainMenuData() {
    return []
  }

  getSubMenuData() {
    return []
  }

  render() {
    const {
      isMobile,
      mobileMenuState,
      subMenuScalar,
    } = this.props
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
          {this.getSubMenuData().map(item => <DataToItem key={item.label} {...item} />)}
        </ul>
        <ul
          className={classNames(Styles.InnerNav__menu, Styles['InnerNav__menu--main'])}
        >
          {this.getMainMenuData().map(item => <DataToItem key={item.label} {...item} />)}
        </ul>
      </aside>
    )
  }
}
