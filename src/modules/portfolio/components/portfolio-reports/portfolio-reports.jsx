import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { augur } from 'services/augurjs'

import { formatAttoRep, formatEther, formatGasCostToEther } from 'utils/format-number'

import { MODAL_CLAIM_REPORTING_FEES } from 'modules/modal/constants/modal-types'

import Styles from './portfolio-reports.styles'

export default class PortfolioReports extends Component {
  static propTypes = {
    loadClaimableFees: PropTypes.func.isRequired,
    claimReportingFees: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    recipient: PropTypes.string.isRequired,
    markets: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      claimableFees: {},
      claimReportingFeesGasEstimate: '0',
    }
  }

  componentWillMount() {
    // TODO: Remove hard-coded parameters below once endpoint exists for getting contracts that are redeemable.
    const claimReportingFeesOptions = {
      redeemableContracts: [
        {
          address: '0x161c723cac007e4283cee4ba11b15277e46eec53',
          type: 2,
        },
      ],
      estimateGas: true,
    }
    this.props.claimReportingFees(claimReportingFeesOptions, (error, result) => {
      const claimReportingFeesGasEstimate = result.gasEstimates.totals.all.toString()
      const gasPrice = augur.rpc.getGasPrice()
      this.setState({
        claimReportingFeesGasEstimate: formatGasCostToEther(claimReportingFeesGasEstimate, { decimalsRounded: 4 }, gasPrice),
      })
    })

    this.setState({
      claimableFees: this.props.loadClaimableFees(),
    })
  }

  render() {
    const p = this.props
    const s = this.state
    const unclaimedRep = formatAttoRep(s.claimableFees.unclaimedRepStaked, { decimals: 4, zeroStyled: true })
    const unclaimedEth = formatEther(s.claimableFees.unclaimedEth, { decimals: 4, zeroStyled: true })

    let disableClaimReportingFeesButton = ''
    if (unclaimedEth.formatted === '-' && unclaimedRep.formatted === '-') {
      disableClaimReportingFeesButton = 'disabled'
    }

    return (
      <section>
        <Helmet>
          <title>Reporting</title>
        </Helmet>
        <article className={Styles.ClaimReportingFeesSection}>
          <h4 className={Styles.ClaimReportingFeesSection__heading}>Claim all available stake and fees</h4>
          <section>
            <article className={Styles.ClaimableFees}>
              <section className={Styles.ClaimableFees__fees}>
                <ul className={Styles['ClaimableFees__fees--list']}>
                  <li>
                    <div className={Styles['ClaimableFees__fees--denomination']}>REP</div>
                    <div className={Styles['ClaimableFees__fees--amount']}>{unclaimedRep.formatted}</div>
                  </li>
                  <li>
                    <div className={Styles['ClaimableFees__fees--denomination']}>ETH</div>
                    <div className={Styles['ClaimableFees__fees--amount']}>{unclaimedEth.formatted}</div>
                  </li>
                </ul>
                <div>
                  <button
                    className={Styles.ClaimableFees__cta}
                    disabled={disableClaimReportingFeesButton}
                    onClick={() => p.updateModal({
                      type: MODAL_CLAIM_REPORTING_FEES,
                      recipient: p.recipient,
                      unclaimedEth,
                      unclaimedRep,
                      gasEstimate: s.claimReportingFeesGasEstimate,
                      canClose: true,
                    })}
                  >Claim
                  </button>
                </div>
              </section>
            </article>
          </section>
        </article>
      </section>
    )
  }
}
