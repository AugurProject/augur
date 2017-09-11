import React from 'react'
import PropTypes from 'prop-types'

import NavPanel from 'modules/common/components/nav-panel/nav-panel'

import { CONNECT_NAV } from 'modules/routes/constants/param-names'
import { ITEMS } from 'modules/auth/constants/connect-nav'

import Styles from 'modules/auth/components/connect/connect.styles'

export default function AuthConnect(p) {
  return (
    <div className={Styles.Connect}>
      <div className={Styles['Connect--constrained']}>
        <div className={Styles.Connect__header}>
          <h1>Connect An Account</h1>
        </div>
        <div className={Styles.Connect__content}>
          <NavPanel
            location={p.location}
            history={p.history}
            items={ITEMS}
            param={CONNECT_NAV}
          />
        </div>
        <div className={Styles.Connect__faq}>
          <span>After</span>
        </div>
      </div>
    </div>
  )
}

AuthConnect.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired
}
