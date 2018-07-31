import React from 'react'
import PropTypes from 'prop-types'
import Styles from 'modules/modal/components/modal-network-mismatch/network-mismatch-message.styles'

const NetworkMismatchMessage = p => (
  <section className={Styles.NetworkMismatchMessage}>
    <span>Your Ethereum node and Augur node are connected to different networks.</span>
    <span>Please connect to a {p.expectedNetwork} Ethereum node.</span>
  </section>
)

NetworkMismatchMessage.propTypes = {
  expectedNetwork: PropTypes.string.isRequired,
}

export default NetworkMismatchMessage
