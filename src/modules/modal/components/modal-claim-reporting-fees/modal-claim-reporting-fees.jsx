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
    this.props.claimReportingFees(claimReportingFeesOptions, (err, result) => {
      // default to 0 for now if we recieve an error.
      const claimReportingFeesGasEstimate = err ? '0' : result.gasEstimates.totals.all.toString()
      const gasPrice = augur.rpc.getGasPrice()
      this.setState({
        claimReportingFeesGasEstimate: formatGasCostToEther(claimReportingFeesGasEstimate, { decimalsRounded: 4 }, gasPrice),
      })
    })
  }

  handleClaimReportingFees(e) {
    e.preventDefault()
    // TODO: Remove hard-coded parameters below once endpoint exists for getting contracts that are redeemable.
    const claimReportingFeesOptions = {
      redeemableContracts: this.props.redeemableContracts,
      estimateGas: false,
    }
    this.props.claimReportingFees(claimReportingFeesOptions, (err, res) => {
      console.log(err, res)
      this.props.closeModal()
    })
  }

  render() {
    const {
      recipient,
      unclaimedRep,
      unclaimedEth,
    } = this.props
    const s = this.state

    return (
      <form
        className={Styles.ModalClaimReportingFees__form}
        onSubmit={this.handleClaimReportingFees}
      >
        <div className={Styles.ModalClaimReportingFees__heading}>
          <h1>Review Withdrawl</h1>
        </div>
        <div className={Styles.ModalClaimReportingFees__details}>
          <ul className={Styles.ModalClaimReportingFees__info}>
            <li><span>Recipient</span><span>{recipient}</span></li>
            <li><span>Rep</span><span>{unclaimedRep.formatted}</span></li>
            <li><span>Eth</span><span>{unclaimedEth.formatted}</span></li>
            <li><span>Gas</span><span>{s.claimReportingFeesGasEstimate}</span></li>
          </ul>
        </div>
        <div className={Styles.ModalClaimReportingFees__message}>
          Transferring all funds may require multiple signed transactions.
        </div>
        <div className={Styles.ModalClaimReportingFees__actions}>
          <button
            className={Styles.ModalClaimReportingFees__button}
            type="submit"
          >
            submit
          </button>
        </div>
      </form>
    )
  }
}
