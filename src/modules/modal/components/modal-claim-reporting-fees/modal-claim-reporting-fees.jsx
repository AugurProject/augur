import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { augur } from 'services/augurjs'
import { formatGasCostToEther } from 'utils/format-number'

import Styles from 'modules/modal/components/modal-claim-reporting-fees/modal-claim-reporting-fees.styles'

export default class ModalClaimReportingFees extends Component {
  static propTypes = {
    claimReportingFees: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    recipient: PropTypes.string.isRequired,
    redeemableContracts: PropTypes.array.isRequired,
    unclaimedEth: PropTypes.object.isRequired,
    unclaimedRep: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      claimReportingFeesGasEstimate: '0',
    }

    this.handleClaimReportingFees = this.handleClaimReportingFees.bind(this)
  }

  componentWillMount() {
    // TODO: Remove hard-coded parameters below once endpoint exists for getting contracts that are redeemable.
    const claimReportingFeesOptions = {
      redeemableContracts: this.props.redeemableContracts,
      estimateGas: true,
    }
    this.props.claimReportingFees(claimReportingFeesOptions, (error, result) => {
      const claimReportingFeesGasEstimate = result.gasEstimates.totals.all.toString()
      const gasPrice = augur.rpc.getGasPrice()
      this.setState({
        claimReportingFeesGasEstimate: formatGasCostToEther(claimReportingFeesGasEstimate, { decimalsRounded: 4 }, gasPrice),
      })
    })
  }

  handleClaimReportingFees() {
    // TODO: Remove hard-coded parameters below once endpoint exists for getting contracts that are redeemable.
    const claimReportingFeesOptions = {
      redeemableContracts: this.props.redeemableContracts,
      estimateGas: false,
    }
    this.props.claimReportingFees(claimReportingFeesOptions, this.props.closeModal)
  }

  render() {
    const p = this.props
    const s = this.state

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
            <span className={Styles['ModalClaimReportingFees__summary--amount']}>{s.claimReportingFeesGasEstimate} Eth</span>
          </li>
        </ul>
        <div className={Styles.ModalClaimReportingFees__message}>
          Transferring all funds may require multiple signed transactions.
        </div>
        <div className={Styles['ModalClaimReportingFees__cta-wrapper']}>
          <button
            className={Styles.ModalClaimReportingFees__cta}
            onClick={this.handleClaimReportingFees}
          >
            Submit
          </button>
        </div>
      </section>
    )
  }
}
