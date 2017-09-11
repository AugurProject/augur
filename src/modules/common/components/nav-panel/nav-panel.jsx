import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import classNames from 'classnames'

import parseQuery from 'modules/routes/helpers/parse-query'
import makeQuery from 'modules/routes/helpers/make-query'
import { CONNECT_NAV } from 'modules/routes/constants/param-names'

import Styles from 'modules/common/components/nav-panel/nav-panel.styles'

function makeSearch(location, param, isItemDefault) {
  const updatedSearch = parseQuery(location.search)

  if (isItemDefault) {
    delete updatedSearch[CONNECT_NAV]
  } else {
    updatedSearch[CONNECT_NAV] = param
  }

  return makeQuery(updatedSearch)
}

export default function NavPanel(p) {
  const selectNav = parseQuery(p.location.search)[CONNECT_NAV] || null

  return (
    <div className={Styles.NavPanel}>
      <aside className={Styles.NavPanel__controls}>
        {
          p.items.map(item => (
            <Link
              key={item.title}
              className={classNames(
                Styles.NavPanel__control,
                {
                  [Styles['NavPanel__control--active']]: selectNav != null ?
                    item.param === selectNav :
                    item.default
                }
              )}
              to={{
                search: makeSearch(p.location, item.param, item.default)
              }}
            >
              <div className={Styles.NavPanel__icon}>
                {item.icon}
              </div>
              <span className={Styles.NavPanel__title}>{item.title}</span>
            </Link>
          ))
        }
      </aside>
    </div>
  )
}

NavPanel.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  param: PropTypes.string.isRequired
}
