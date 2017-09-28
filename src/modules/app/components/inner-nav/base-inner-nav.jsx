import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import Styles from 'modules/app/components/inner-nav/inner-nav.styles'

import parseStringToArray from 'modules/routes/helpers/parse-string-to-array'
import makeQuery from 'modules/routes/helpers/make-query'
import makePath from 'modules/routes/helpers/make-path'

import { QUERY_VALUE_DELIMITER } from 'modules/routes/constants/query-value-delimiter'
import { TOPIC_PARAM_NAME, TAGS_PARAM_NAME } from 'modules/filter-sort/constants/param-names'
import { MARKETS } from 'modules/routes/constants/views'

import MenuItem from 'modules/app/components/inner-nav/menu-item'

export default class BaseInnerNav extends React.Component {

  render() {
    const showMainMenu = this.props.mobileMenuState >= mobileMenuStates.SUBMENU_OPEN
    const showSubMenu = this.props.mobileMenuState === mobileMenuStates.MAINMENU_OPEN

    let subMenuAnimatedStyle
    if (!this.props.isMobile) {
      animatedStyle = { left: (110 * this.props.subMenuScalar) }
    }

    const dataToItem = (item) => (
      <MenuItem
        isSelected={item.isSelected}
        key={item.label}
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
    );

    return (
      <aside
        className={classNames(
          Styles.InnerNav,
          { [Styles.mobileShow]: showCategories }
        )}
      >
        <ul
          className={classNames(
            Styles.InnerNav__menu,
            Styles['InnerNav__menu--submenu'],
            { [Styles['InnerNav__menu--submenu--mobileshow']]: showKeywords }
          )}
          style={subMenuAnimatedStyle}
        >
          {map(this.getSubMenuData(), dataToItem)}
        </ul>
        <ul
          className={classNames(
            Styles.InnerNav__menu, Styles['InnerNav__menu--main']
          )}
        >
          {map(this.getMainMenuData(), dataToItem)}
        </ul>
      </aside>
    )
  }
}
