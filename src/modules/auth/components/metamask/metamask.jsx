import React from 'react'

import Styles from 'modules/auth/components/metamask/metamask.styles'

export default function Trezor() {
  return (
    <section className={Styles.MetaMask__connect}>
      <div className={Styles.MetaMask__content}>
        <h3>
          Connect Via MetaMask
        </h3>
        <span>
          MetaMask is a secure identity vault that allows you to manage your identities across different dApps.
        </span>
        <span>
          Install the browser plugin at <a href="https://metamask.io/">metamask.io</a>.
        </span>
        <hr />
        <span>
          Note: If MetaMask is installed & unlocked, you will be logged in automatically.
        </span>
      </div>
    </section>
  )
}
