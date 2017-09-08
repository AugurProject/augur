import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import GraphBG from 'modules/common/components/graph-background/graph-background'

import makePath from 'modules/routes/helpers/make-path'

import { SIGNUP, LOGIN } from 'modules/routes/constants/views'

import Styles from 'modules/auth/components/auth-lander/auth-lander.styles'

export default function AuthLander(p) {
  return (
    <section className={Styles.AuthView}>
      <Helmet>
        <title>Authentication</title>
      </Helmet>
      <GraphBG />
      <div className={Styles.AuthView__content}>
        <div className={Styles.AuthView__spacer}>
          <h1 className={Styles.AuthView__header}>Link an ethereum account {!p.isMobile && <br />} to bet on anything from anywhere</h1>
        </div>
        <div className={Styles.AuthView__actions}>
          <Link
            className={Styles.AuthView__button}
            to={makePath(LOGIN)}
          >
            connect account
          </Link>
          <Link
            className={Styles.AuthView__button}
            to={makePath(SIGNUP)}
          >
            create account
          </Link>
        </div>
        <div className={Styles.AuthView__spacer} />
      </div>
    </section>
  )
}
