import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import NavPanel from 'modules/common/components/nav-panel/nav-panel'
// import Airbitz from 'modules/auth/containers/airbitz-create'
import UportCreate from 'modules/auth/containers/uport-create'

import parseQuery from 'modules/routes/helpers/parse-query'

import { CREATE_NAV } from 'modules/routes/constants/param-names'
import { ITEMS } from 'modules/auth/constants/create-nav'
import { TITLE_SUFFIX } from 'modules/app/constants/title-suffix'

import Styles from 'modules/auth/components/auth/auth.styles'

export default function AuthCreate(p) {
  const selectedNav = parseQuery(p.location.search)[CREATE_NAV] || null

  return (
    <div className={Styles.Auth}>
      <Helmet
        titleTemplate={`Create %s ${TITLE_SUFFIX}`}
      />
      <div className={Styles['Auth--constrained']}>
        <div className={Styles.Auth__header}>
          <h1>Create An Account</h1>
        </div>
        <div className={Styles.Auth__content}>
          <NavPanel
            location={p.location}
            history={p.history}
            items={ITEMS}
            param={CREATE_NAV}
            selectedNav={selectedNav}
          />
          <div className={Styles.Auth__connections}>
            <UportCreate />
          </div>
        </div>
      </div>
    </div>
  )
}

AuthCreate.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
}
