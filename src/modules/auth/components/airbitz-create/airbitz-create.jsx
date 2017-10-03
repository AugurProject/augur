import React from 'react'
import classNames from 'classnames'
import Helmet from 'react-helmet'

import Styles from 'modules/auth/components/airbitz-create/airbitz-create.styles'

export default function Airbitz() {
  return (
    <section className={Styles.Airbitz}>
      <Helmet>
        <title>Airbitz</title>
      </Helmet>
      <button
        className={
          classNames(
            Styles.button,
            Styles[`button--purple`],
            Styles.Airbitz__button
          )
        }
      >
        Create Account with Airbitz
      </button>
    </section>
  )
}
