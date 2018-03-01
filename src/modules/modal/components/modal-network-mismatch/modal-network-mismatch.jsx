import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/modal/components/modal-network-mismatch/modal-network-mismatch.styles'

const ModalNetworkMismatch = p => (
  <section className={Styles.ModalNetworkMismatch}>
    <h1>Network Mismatch</h1>
    <span>The network set on the connected ethereum node does not match the contract network.</span>
    <span>Please set network to: {p.expectedNetwork}</span>
  </section>
)

ModalNetworkMismatch.propTypes = {
  expectedNetwork: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default ModalNetworkMismatch
