import React from 'react'
import { Link } from 'react-router-dom'

import GraphBG from 'modules/common/components/graph-background/graph-background'

import makePath from 'modules/routes/helpers/make-path'

import { AUTHENTICATION, CONNECT, CREATE } from 'modules/routes/constants/views'

import Styles from 'modules/auth/components/lander/lander.styles'

export default function Lander(p) {
  return (
    <div className={Styles.Lander}>
      <GraphBG />
      <div className={Styles.Lander__content}>
        <div className={Styles.Lander__spacer}>
          <h1 className={Styles.Lander__header}>Link an ethereum account {!p.isMobile && <br />} to bet on anything from anywhere</h1>
        </div>
        <div className={Styles.Lander__actions}>

          <Link
            className={Styles.Lander__button}
            to={makePath([AUTHENTICATION, CONNECT])}
          >
            connect account
          </Link>
          <Link
            className={Styles.Lander__button}
            to={makePath([AUTHENTICATION, CREATE])}
          >
            create account
          </Link>
        </div>
        <div className={Styles.Lander__spacer} />
        <div className={Styles.Lander__footer}>
          <a
            href="https://augur.net/terms.txt"
            target="blank"
          >
            Terms & Conditions
          </a>
          <a
            href="http://terms.augur.net/"
            target="blank"
          >
            Privacy Policy
          </a>
          <a
            href="https://augur.net/license.txt"
            target="blank"
          >
            Licensing Agreement
          </a>
        </div>
      </div>
    </div>
  )
}
