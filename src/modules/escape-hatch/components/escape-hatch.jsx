import React, { Component } from 'react'
import Styles from 'modules/escape-hatch/components/escape-hatch.styles'
import { formatGasCost, formatEtherEstimate } from 'utils/format-number'
import PropTypes from 'prop-types'

export default class EscapeHatchView extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    loginAccount: PropTypes.object.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    withdrawFundsInEmergency: PropTypes.func.isRequired,
    escapeHatchData: PropTypes.object.isRequired,
    loadParticipationTokens: PropTypes.func.isRequired,
    loadInitialReporters: PropTypes.func.isRequired,
    loadDisputeCrowdsourcers: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      fundsAvailableForWithdrawl: false,
      onEscapeHatchLanding: true,
    }

    this.withdraw = this.withdraw.bind(this)
    this.confirm = this.confirm.bind(this)
  }

  componentWillMount() {
    const {
      loadDisputeCrowdsourcers,
      loadInitialReporters,
      loadMarkets,
      loadParticipationTokens,
      loginAccount,
    } = this.props
    if (loginAccount.address) {
      loadMarkets()
      loadParticipationTokens()
      loadInitialReporters()
      loadDisputeCrowdsourcers()
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      loadDisputeCrowdsourcers,
      loadInitialReporters,
      loadMarkets,
      loadParticipationTokens,
      loginAccount,
    } = this.props
    if (!loginAccount.address && nextProps.loginAccount.address) {
      loadMarkets()
      loadParticipationTokens()
      loadInitialReporters()
      loadDisputeCrowdsourcers()
    }
    this.setState({ fundsAvailableForWithdrawl: nextProps.escapeHatchData.fundsAvailableForWithdrawl > 0 })
  }

  withdraw(e, ...args) {
    e.preventDefault()
    this.setState({ onEscapeHatchLanding: false })
  }

  confirm(e, ...args) {
    const {
      escapeHatchData,
      withdrawFundsInEmergency,
    } = this.props
    withdrawFundsInEmergency(escapeHatchData.ownedMarketsWithFunds, escapeHatchData.marketsWithShares)
  }

  render() {
    const {
      escapeHatchData,
      loginAccount,
    } = this.props
    const s = this.state

    return (
      <section className={Styles.EscapeHatch}>
        {s.onEscapeHatchLanding &&
        <div className={Styles.EscapeHatch_LandingContainer}>
          <img
            className={Styles.EscapeHatch_AlertIcon}
            alt="Alert"
            src="../../assets/images/alert-icon.svg"
          />
          {s.fundsAvailableForWithdrawl &&
          <h1 className={Styles.EscapeHatch_AlertHeader}>Action required</h1>
          }
          <div className={Styles.EscapeHatch_Text}>Augur&#39;s development team has identified a potential vulnerability within its contracts and has frozen all activity in order to protect your funds. {s.fundsAvailableForWithdrawl && <span>Withdraw your funds by clicking the button below.</span> }</div>
          {s.fundsAvailableForWithdrawl &&
          <div className={Styles.EscapeHatch_Text}>Please note: Transferring all funds may require multiple signed transactions.</div>
          }
          {!s.fundsAvailableForWithdrawl &&
          <div className={Styles.EscapeHatch_Text}>You currently have no funds available to withdraw. If you believe this is incorrect, please contact support.</div>
          }
          {s.fundsAvailableForWithdrawl &&
          <button onClick={this.withdraw} className={Styles.EscapeHatch_WithdrawButton}>Withdraw all funds</button>
          }
        </div>
        }
        {!s.onEscapeHatchLanding &&
        <div className={Styles.EscapeHatch_ReviewContainer}>
          <h1 className={Styles.EscapeHatch_ReviewHeader}>Review withdrawl</h1>
          <hr />
          <article className={Styles.EscapeHatch_ReviewSummary}>
            <div>
              <span className={Styles.EscapeHatch_LabelCell}>Recipient</span>
              <span>{loginAccount.address}</span>
            </div>
            <div>
              <span className={Styles.EscapeHatch_LabelCell}>REP</span>
              <span>{formatEtherEstimate(escapeHatchData.rep).rounded}</span>
            </div>
            <div>
              <span className={Styles.EscapeHatch_LabelCell}>ETH</span>
              <span>{formatEtherEstimate(escapeHatchData.eth).rounded}</span>
            </div>
            <div>
              <span className={Styles.EscapeHatch_LabelCell}>GAS</span>
              <span>{formatGasCost(escapeHatchData.gas).rounded}</span>
            </div>
          </article>
          <hr />
          <button onClick={this.confirm} className={Styles.EscapeHatch_ConfirmButton}>Confirm</button>
        </div>
        }
      </section>
    )
  }
}
