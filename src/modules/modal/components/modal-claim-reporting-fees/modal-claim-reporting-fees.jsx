import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/modal/components/modal-claim-reporting-fees/modal-claim-reporting-fees.styles'

export default class ModalClaimReportingFees extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    rep: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    claimReportingFees: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    const p = this.props

    return (
      <section className={Styles.ModalClaimReportingFees}>
        <div className={Styles.ModalClaimReportingFees__header}>
          <h1>Review Withdrawl</h1>
        </div>
        <ul className={Styles.ModalClaimReportingFees__summary}>
          <li>
            <span className={Styles['ModalClaimReportingFees__summary--denomination']}>Recipient</span>
            <span className={Styles['ModalClaimReportingFees__summary--amount']}>{p.recipient}</span>
          </li>
          <li>
            <span className={Styles['ModalClaimReportingFees__summary--denomination']}>Rep</span>
            <span className={Styles['ModalClaimReportingFees__summary--amount']}>{p.unclaimedRep.formatted} Rep</span>
          </li>
          <li>
            <span className={Styles['ModalClaimReportingFees__summary--denomination']}>Eth</span>
            <span className={Styles['ModalClaimReportingFees__summary--amount']}>{p.unclaimedEth.formatted} Eth</span>
          </li>
          <li>
            <span className={Styles['ModalClaimReportingFees__summary--denomination']}>Gas</span>
            <span className={Styles['ModalClaimReportingFees__summary--amount']}>{p.gasEstimate} Eth</span>
          </li>
        </ul>
        <div className={Styles.ModalClaimReportingFees__message}>
          Transferring all funds may require multiple signed transactions.
        </div>
        <div className={Styles['ModalClaimReportingFees__cta-wrapper']}>
          <button
            className={Styles.ModalClaimReportingFees__cta}
            onClick={() => p.closeModal()}
          >
            Submit
          </button>
        </div>
      </section>
    )
  }
}
