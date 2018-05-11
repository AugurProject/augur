import React from 'react'
import Styles from 'modules/modal/components/modal-network-disabled/modal-network-disabled.styles'

const ModalNetworkDisabled = p => (
  <section className={Styles.NetworkDisabled}>
    <h1>Network Disabled</h1>
    <section className={Styles.NetworkDisabledMessage}>
      <span>Connecting to mainnet through this UI is disabled.</span>
    </section>
  </section>
)

export default ModalNetworkDisabled
