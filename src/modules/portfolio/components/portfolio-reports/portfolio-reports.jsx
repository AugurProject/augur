import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { formatAttoRep, formatEther } from 'utils/format-number'

import { MODAL_CLAIM_REPORTING_FEES } from 'modules/modal/constants/modal-types'

import Styles from 'modules/portfolio/components/portfolio-reports/portfolio-reports.styles'

export default class PortfolioReports extends Component {
  static propTypes = {
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
    const {
      unclaimedEth,
      unclaimedRep,
      redeemableContracts,
    } = this.state
    this.props.updateModal({
      type: MODAL_CLAIM_REPORTING_FEES,
      unclaimedEth,
      unclaimedRep,
      redeemableContracts,
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
      <section className={Styles.PortfolioReports}>
        <Helmet>
          <title>Reporting</title>
        </Helmet>
        <h4>
          Claim all available stake and fees
        </h4>
        <div className={Styles.PortfolioReports__details}>
          <ul className={Styles.PortfolioReports__info}>
            <li><span>REP</span><span>{s.unclaimedRep.formatted}</span></li>
            <li><span>ETH</span><span>{s.unclaimedEth.formatted}</span></li>
          </ul>
          <button
            className={Styles.PortfolioReports__claim}
            disabled={disableClaimReportingFeesButton}
            onClick={this.handleClaimReportingFees}
          >
            Claim
          </button>
        </div>
      </section>
    )
  }
}
