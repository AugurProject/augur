import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { augur } from 'services/augurjs'

// import from 'modules/actions'

import Styles from 'modules/modal/components/modal-claim-all/modal-claim-all.styles'

function claimAllReportingFees(marketAddresses) {
  console.log('in claimAllReportingFees')
}

const ModalClaimAll = p => (
  <section className={Styles.ModalClaimAll}>
    <div className={Styles.ModalClaimAll__header}>
      <h1>Review Withdrawl</h1>
    </div>
    <ul className={Styles.ModalClaimAll__summary}>
      <li>
        <span className={Styles['ModalClaimAll__summary--denomination']}>Recipient</span>
        <span className={Styles['ModalClaimAll__summary--amount']}>{p.recipient}</span>
      </li>
      <li>
        <span className={Styles['ModalClaimAll__summary--denomination']}>Rep</span>
        <span className={Styles['ModalClaimAll__summary--amount']}>{p.unclaimedRep.formatted} Rep</span>
      </li>
      <li>
        <span className={Styles['ModalClaimAll__summary--denomination']}>Eth</span>
        <span className={Styles['ModalClaimAll__summary--amount']}>{p.unclaimedEth.formatted} Eth</span>
      </li>
      <li>
        <span className={Styles['ModalClaimAll__summary--denomination']}>Gas</span>
        <span className={Styles['ModalClaimAll__summary--amount']}> Eth</span>
      </li>
    </ul>
    <div className={Styles.ModalClaimAll__message}>
      Transferring all funds may require multiple signed transactions.
    </div>
    <div className={Styles['ModalClaimAll__cta-wrapper']}>
      <button
        className={Styles.ModalClaimAll__cta}
        onClick={claimAllReportingFees([
          '0x8be6046a35e8f2f0e20f0a61a01174c2041c3fc6',
        ]) }
      >
        Submit
      </button>
    </div>
  </section>
)

ModalClaimAll.propTypes = {
  recipient: PropTypes.string.isRequired,
  unclaimedEth: PropTypes.object.isRequired,
  unclaimedRep: PropTypes.object.isRequired,
}

export default ModalClaimAll

