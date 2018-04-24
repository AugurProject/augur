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
    feeWindows: PropTypes.array.isRequired,
    forkedMarket: PropTypes.object.isRequired,
    nonForkedMarkets: PropTypes.array.isRequired,
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
    const claimReportingFeesOptions = {
      feeWindows: this.props.feeWindows,
      forkedMarket: this.props.forkedMarket,
      nonForkedMarkets: this.props.nonForkedMarkets,
      estimateGas: true,
      onSent: () => {},
      onFailed: (err) => {
        // Default to 0 for now if we recieve an error.
        const claimReportingFeesGasEstimate = '0'
        const gasPrice = augur.rpc.getGasPrice()
        this.setState({
          claimReportingFeesGasEstimate: formatGasCostToEther(claimReportingFeesGasEstimate, { decimalsRounded: 4 }, gasPrice),
        })
      },
      onSuccess: (result) => {
        // Default to 0 for now if we recieve an error.
        const claimReportingFeesGasEstimate = result.gasEstimates.totals.all.toString()
        const gasPrice = augur.rpc.getGasPrice()
        this.setState({
          claimReportingFeesGasEstimate: formatGasCostToEther(claimReportingFeesGasEstimate, { decimalsRounded: 4 }, gasPrice),
        })
      },
    }
    this.props.claimReportingFees(claimReportingFeesOptions)
  }

  handleClaimReportingFees(e) {
    e.preventDefault()
    const claimReportingFeesOptions = {
      feeWindows: this.props.feeWindows,
      forkedMarket: this.props.forkedMarket,
      nonForkedMarkets: this.props.nonForkedMarkets,
      estimateGas: false,
      onSent: () => {},
      onFailed: (err) => {
        this.props.closeModal()
      },
      onSuccess: (result) => {
        this.props.closeModal()
      },
    }
    this.props.claimReportingFees(claimReportingFeesOptions)
  }

  render() {
    const {
      recipient,
      unclaimedRep,
      unclaimedEth,
    } = this.props
    const s = this.state

    // In theory, this modal should never be shown if there is no unclaimed ETH/REP, but check whether button should be disabled anyway.
    let disableClaimReportingFeesButton = ''
    if (unclaimedRep.formatted === '-' && unclaimedEth.formatted === '-') {
      disableClaimReportingFeesButton = 'disabled'
    }

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
            disabled={disableClaimReportingFeesButton}
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    )
  }
}
