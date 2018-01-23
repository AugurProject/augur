import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/modal/components/modal-network-disconnected/modal-network-disconnected.styles'

const ModalNetworkDisconnected = p => {
  console.log('modalNetworkDisconnected p:', p)
return (
  <section className={Styles.ModalNetworkDisconnected}>
    <h1>Reconnecting to Augur Node</h1>
    <span>You have been disconnected from your Augur Node. Please wait while we try to reconnect you, or update your node address here.</span>
    <span>Augur Node Address: {!!p.env['augur-node'] && p.env['augur-node']}</span>
    <span>Ethereum Node Http/ws Addresses:</span>
    <span>http: {!!p.env['ethereum-node'] && p.env['ethereum-node'].http}</span>
    <span>ws: {!!p.env['ethereum-node'] && p.env['ethereum-node'].ws}</span>
  </section>
)}

ModalNetworkDisconnected.propTypes = {
  // expectedNetwork: PropTypes.number.isRequired
}

export default ModalNetworkDisconnected
