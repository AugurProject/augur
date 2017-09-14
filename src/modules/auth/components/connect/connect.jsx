import React from 'react'
import PropTypes from 'prop-types'

import NavPanel from 'modules/common/components/nav-panel/nav-panel'
import Help from 'modules/auth/components/help/help'
import Airbitz from 'modules/auth/containers/airbitz'
import Ledger from 'modules/auth/containers/ledger'
import Uport from 'modules/auth/containers/uport'
import Keystore from 'modules/auth/containers/keystore'
import Trezor from 'modules/auth/containers/trezor'
import Metamask from 'modules/auth/components/metamask/metamask'

import parseQuery from 'modules/routes/helpers/parse-query'

import { CONNECT_NAV } from 'modules/routes/constants/param-names'
import { ITEMS, PARAMS } from 'modules/auth/constants/connect-nav'

import Styles from 'modules/auth/components/auth/auth.styles'

export default function AuthConnect(p) {
  const selectedNav = parseQuery(p.location.search)[CONNECT_NAV] || null

  return (
    <div className={Styles.Auth}>
      <div className={Styles['Auth--constrained']}>
        <div className={Styles.Auth__header}>
          <h1>Connect An Account</h1>
        </div>
        <div className={Styles.Auth__content}>
          <NavPanel
            location={p.location}
            history={p.history}
            items={ITEMS}
            param={CONNECT_NAV}
            selectedNav={selectedNav}
          />
          <div className={Styles.Auth__connections}>
            {selectedNav == null &&
              <Airbitz />
            }
            {selectedNav === PARAMS.METAMASK &&
              <Metamask />
            }
            {selectedNav === PARAMS.LEDGER &&
              <Ledger />
            }
            {selectedNav === PARAMS.UPORT &&
              <Uport />
            }
            {selectedNav === PARAMS.KEYSTORE &&
              <Keystore />
            }
            {selectedNav === PARAMS.TREZOR &&
              <Trezor />
            }
          </div>
        </div>
        <div className={Styles.Auth__faq}>
          <Help />
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
