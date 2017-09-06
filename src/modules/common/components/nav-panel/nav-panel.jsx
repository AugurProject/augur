import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'
import Styles from 'modules/common/components/nav-panel/nav-panel.styles'

import parseQuery from 'modules/app/helpers/parse-query'
import makeQuery from 'modules/app/helpers/make-query'
import { NAVPANEL_ID_PARAM_NAME } from 'modules/app/constants/param-names'

const NavPanel = (p) => {
  const selectedNavId = decodeURIComponent(parseQuery(p.location.search)[NAVPANEL_ID_PARAM_NAME] || '')

  const toggleNavId = (id) => {
    const searchParams = makeQuery({
      ...(parseQuery(p.location.search)),
      [NAVPANEL_ID_PARAM_NAME]: id
    })

    p.history.push({
      ...p.location,
      search: searchParams
    })
  }

  return (
    <div
      className={classNames({
        [Styles.NavPanel]: true,
        [Styles['NavPanel--flipped']]: p.flipped
      })}
    >
      <aside className={Styles.NavPanel__controls}>
        {p.items && p.items.map((item, ind) => {
          const Icon = item.iconComponent
          const active = selectedNavId === item.title

          return (
            <button
              className={classNames(
                Styles.NavPanel__control,
                {
                  [Styles['NavPanel__control--active']]: active
                })}
              key={`${item.title}${ind - p.items.length}`}
              onClick={() => toggleNavId(item.title)}
            >
              <Icon className={Styles.NavPanel__icon} />
              {item.title}
            </button>
          )
        })}
      </aside>
      <div className={Styles.NavPanel__content}>
        {p.children}
      </div>
    </div>
  )
}

NavPanel.propTypes = {
  flipped: PropTypes.bool,
  history: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired
}

export default NavPanel
