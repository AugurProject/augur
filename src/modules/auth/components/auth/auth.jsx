import React from 'react'
import { Helmet } from 'react-helmet'
import { Route } from 'react-router-dom'

import makePath from 'modules/routes/helpers/make-path'

import { AUTHENTICATION, CONNECT, CREATE } from 'modules/routes/constants/views'
import { AuthLander, AuthConnect, AuthCreate } from 'modules/routes/constants/components'

import Styles from 'modules/auth/components/auth/auth.styles'

export default function Auth(p) {
  return (
    <section className={Styles.Auth}>
      <Helmet>
        <title>Authentication</title>
      </Helmet>
      <Route exact path={makePath(AUTHENTICATION)} component={AuthLander} />
      <Route path={makePath([AUTHENTICATION, CONNECT])} component={AuthConnect} />
      <Route path={makePath([AUTHENTICATION, CREATE])} component={AuthCreate} />
    </section>
  )
}
