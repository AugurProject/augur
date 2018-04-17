import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import NavPanel from 'modules/common/components/nav-panel/nav-panel'
// import Airbitz from 'modules/auth/containers/airbitz-connect'
import LedgerConnect from 'modules/auth/containers/ledger-connect'
import UportConnect from 'modules/auth/containers/uport-connect'
import MetaMaskConnect from 'modules/auth/components/metamask/metamask'

import parseQuery from 'modules/routes/helpers/parse-query'

import { CONNECT_NAV } from 'modules/routes/constants/param-names'
import { ITEMS, PARAMS } from 'modules/auth/constants/connect-nav'
import { TITLE_SUFFIX } from 'modules/app/constants/title-suffix'

import Styles from 'modules/auth/components/auth/auth.styles'

export default function AuthConnect(p) {
  const selectedNav = parseQuery(p.location.search)[CONNECT_NAV] || null

  return (
    <div className={Styles.Auth}>
      <Helmet
        titleTemplate={`Connect -- %s ${TITLE_SUFFIX}`}
      />
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
            {(selectedNav == null || selectedNav === PARAMS.METAMASK) &&
              <MetaMaskConnect />
            }
            {selectedNav === PARAMS.LEDGER &&
              <LedgerConnect />
            }
            {selectedNav === PARAMS.UPORT &&
              <UportConnect />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

AuthConnect.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
}
