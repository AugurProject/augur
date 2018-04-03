import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { formatAttoRep, formatEther } from 'utils/format-number'

import { MODAL_CLAIM_REPORTING_FEES } from 'modules/modal/constants/modal-types'

import Styles from './portfolio-reports.styles'

export default class PortfolioReports extends Component {
  static propTypes = {
    claimReportingFees: PropTypes.func.isRequired,
    loadClaimableFees: PropTypes.func.isRequired,
    updateModal: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleClaimReportingFees = this.handleClaimReportingFees.bind(this)
  }

  componentWillMount() {
    const claimableFees = this.props.loadClaimableFees()
    const redeemableContracts = [
      {
        address: '0x161c723cac007e4283cee4ba11b15277e46eec53',
        type: 2,
      },
    ]
    this.setState({
      unclaimedEth: formatEther(claimableFees.unclaimedEth, { decimals: 4, zeroStyled: true }),
      unclaimedRep: formatAttoRep(claimableFees.unclaimedRepStaked, { decimals: 4, zeroStyled: true }),
      redeemableContracts,
    })
  }

  handleClaimReportingFees() {
    const s = this.state
    this.props.updateModal({
      type: MODAL_CLAIM_REPORTING_FEES,
      unclaimedEth: s.unclaimedEth,
      unclaimedRep: s.unclaimedRep,
      redeemableContracts: s.redeemableContracts,
      canClose: true,
    })
  }

  render() {
    const s = this.state

    let disableClaimReportingFeesButton = ''
    if (s.unclaimedEth.formatted === '-' && s.unclaimedRep.formatted === '-') {
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
                    <div className={Styles['ClaimableFees__fees--amount']}>{s.unclaimedRep.formatted}</div>
                  </li>
                  <li>
                    <div className={Styles['ClaimableFees__fees--denomination']}>ETH</div>
                    <div className={Styles['ClaimableFees__fees--amount']}>{s.unclaimedEth.formatted}</div>
                  </li>
                </ul>
                <div>
                  <button
                    className={Styles.ClaimableFees__cta}
                    disabled={disableClaimReportingFeesButton}
                    onClick={this.handleClaimReportingFees}
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
