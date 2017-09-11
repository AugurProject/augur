import React from 'react'
import PropTypes from 'prop-types'

import NavPanel from 'modules/common/components/nav-panel/nav-panel'
import Airbitz from 'modules/auth/containers/airbitz'
import Ledger from 'modules/auth/containers/ledger'
import Uport from 'modules/auth/containers/uport'
import Keystore from 'modules/auth/containers/keystore'
import Trezor from 'modules/auth/containers/trezor'

import parseQuery from 'modules/routes/helpers/parse-query'

import { CONNECT_NAV } from 'modules/routes/constants/param-names'
import { ITEMS, PARAMS } from 'modules/auth/constants/connect-nav'

import Styles from 'modules/auth/components/connect/connect.styles'

function renderConnectionMethod(selectedNav) {
  switch (selectedNav) {
    case PARAMS.LEDGER:
      return <Ledger />
    case PARAMS.UPORT:
      return <Uport />
    case PARAMS.KEYSTORE:
      return <Keystore />
    case PARAMS.TREZOR:
      return <Trezor />
    default:
      return <Airbitz />
  }
}

export default function AuthConnect(p) {
  const selectedNav = parseQuery(p.location.search)[CONNECT_NAV] || null

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
            selectedNav={selectedNav}
          />
          <div className={Styles.Connect__connections}>
            {renderConnectionMethod(selectedNav)}
          </div>
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
