import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import parseQuery from 'modules/routes/helpers/parse-query'
import makeQuery from 'modules/routes/helpers/make-query'
import { CONNECT_NAV } from 'modules/routes/constants/param-names'

import Styles from 'modules/common/components/nav-panel/nav-panel.styles'

// TODO --
// param to observe
// nav items
// update param accordingly

export default function NavPanel(p) {
  const selectNav = parseQuery(p.location.search)[CONNECT_NAV] || null
  // const selectedNavId = decodeURIComponent(parseQuery(p.location.search)[NAVPANEL_ID_PARAM_NAME] || '')
  //
  // const toggleNavId = (id) => {
  //   const searchParams = makeQuery({
  //     ...(parseQuery(p.location.search)),
  //     [NAVPANEL_ID_PARAM_NAME]: id
  //   })
  //
  //   p.history.push({
  //     ...p.location,
  //     search: searchParams
  //   })
  // }

  return (
    <div className={Styles.NavPanel}>
      <aside className={Styles.NavPanel__controls}>
        {
          p.items.map(item => (
            <button
              key={item.title}
              className={classNames(
                Styles.NavPanel__control,
                {
                  [Styles['NavPanel__control--active']]: selectNav != null ? item.param === selectNav : item.default
                }
              )}
            >
              {item.title}
            </button>
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

// <item.icon />

// <aside className={Styles.NavPanel__controls}>
//   {p.items && p.items.map((item, ind) => {
//     const Icon = item.iconComponent
//     const active = selectedNavId === item.title
//
//     return (
//       <button
//         className={classNames(
//           Styles.NavPanel__control,
//           {
//             [Styles['NavPanel__control--active']]: active
//           })}
//         key={`${item.title}${ind - p.items.length}`}
//         onClick={() => toggleNavId(item.title)}
//       >
//         <Icon className={Styles.NavPanel__icon} />
//         {item.title}
//       </button>
//     )
//   })}
// </aside>
