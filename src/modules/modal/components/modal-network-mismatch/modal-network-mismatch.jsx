import React from 'react'
import PropTypes from 'prop-types'
import isMetaMask from 'modules/auth/helpers/is-meta-mask'
import NetworkMismatchMessage from 'modules/modal/components/modal-network-mismatch/network-mismatch-message'
import MetaMaskNetworkMismatchMessage from 'modules/modal/components/modal-network-mismatch/meta-mask-network-mismatch-message'
import Styles from 'modules/modal/components/modal-network-mismatch/modal-network-mismatch.styles'

const ModalNetworkMismatch = p => (
  <section className={Styles.ModalNetworkMismatch}>
    <h1>Network Mismatch</h1>
    {isMetaMask() ?
      <MetaMaskNetworkMismatchMessage {...p} expectedNetwork={p.expectedNetwork} /> :
      <NetworkMismatchMessage {...p} expectedNetwork={p.expectedNetwork} />
    }
  </section>
)

ModalNetworkMismatch.propTypes = {
  expectedNetwork: PropTypes.string.isRequired,
}

export default ModalNetworkMismatch
