import React from 'react'
import PropTypes from 'prop-types'
import Styles from 'modules/modal/components/modal-network-mismatch/network-mismatch-message.styles'

const MetaMaskNetworkMismatchMessage = p => (
  <section className={Styles.NetworkMismatchMessage}>
    <span>MetaMask is connected to the wrong Ethereum network.</span>
    <span>Please set the MetaMask network to: {p.expectedNetwork}</span>
  </section>
)

MetaMaskNetworkMismatchMessage.propTypes = {
  expectedNetwork: PropTypes.string.isRequired,
}

export default MetaMaskNetworkMismatchMessage
