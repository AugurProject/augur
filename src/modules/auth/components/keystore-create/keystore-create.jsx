import React from 'react'
import Helmet from 'react-helmet'

import Styles from 'modules/auth/components/keystore-create/keystore-create.styles'

export default function Keystore() {
  return (
    <section className={Styles.Keystore}>
      <Helmet>
        <title>Keystore</title>
      </Helmet>
      <div className={Styles.Keystore__content}>
        <form className={Styles.Keystore__form}>
          <h3>We will generate a keystore that is only accessible with your passphrase.</h3>
          <label
            htmlFor="keyword_create_passphrase"
          >
            Passphrase
          </label>
          <input
            id="keyword_create_passphrase"
            type="text"
          />
          <label
            htmlFor="keyword_create_passphrase-confirm"
          >
            Confirm
          </label>
          <input
            id="keyword_create_passphrase_confirm"
            type="text"
          />
        </form>
        <div className={Styles.Keystore__instruction}>
          <span>Testing...</span>
        </div>
      </div>
    </section>
  )
}
