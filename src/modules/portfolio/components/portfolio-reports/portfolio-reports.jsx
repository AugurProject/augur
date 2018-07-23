import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import PortfolioReportsForkedMarketCard from 'modules/portfolio/components/portfolio-reports/portfolio-reports-forked-market-card'
import { MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET, MODAL_CLAIM_REPORTING_FEES_NONFORKED_MARKETS } from 'modules/modal/constants/modal-types'
import { TYPE_CLAIM_PROCEEDS } from 'modules/market/constants/link-types'
import Styles from 'modules/portfolio/components/portfolio-reports/portfolio-reports.styles'

export default class PortfolioReports extends Component {
  static propTypes = {
    currentTimestamp: PropTypes.number.isRequired,
    getReportingFees: PropTypes.func.isRequired,
    isLogged: PropTypes.bool.isRequired,
    finalizeMarket: PropTypes.func.isRequired,
    forkedMarket: PropTypes.object,
    getWinningBalances: PropTypes.func.isRequired,
    updateModal: PropTypes.func.isRequired,
    reportingFees: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleClaimReportingFeesForkedMarket = this.handleClaimReportingFeesForkedMarket.bind(this)
    this.handleClaimReportingFeesNonforkedMarkets = this.handleClaimReportingFeesNonforkedMarkets.bind(this)
    this.modalCallback = this.modalCallback.bind(this)
  }

  componentWillMount() {
    this.props.getReportingFees()
  }

  handleClaimReportingFeesNonforkedMarkets() {
    this.props.updateModal({
      type: MODAL_CLAIM_REPORTING_FEES_NONFORKED_MARKETS,
      ...this.props.reportingFees,
      canClose: true,
      modalCallback: this.modalCallback,
    })
  }

  handleClaimReportingFeesForkedMarket = () => {
    const { unclaimedForkEth, unclaimedForkRepStaked, forkedMarket } = this.props.reportingFees
    this.props.updateModal({
      type: MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET,
      unclaimedEth: unclaimedForkEth,
      unclaimedRep: unclaimedForkRepStaked,
      forkedMarket,
      canClose: true,
      modalCallback: this.modalCallback,
    })
  }

  modalCallback = (results) => {
    this.props.getReportingFees()
  }

  render() {
    const {
      currentTimestamp,
      finalizeMarket,
      forkedMarket,
      reportingFees,
    } = this.props
    let disableClaimReportingFeesNonforkedMarketsButton = ''
    if (reportingFees.unclaimedEth.formatted === '-' && reportingFees.unclaimedRep.formatted === '-') {
      disableClaimReportingFeesNonforkedMarketsButton = 'disabled'
    }
    const userHasClaimableForkFees = reportingFees.forkedMarket && (reportingFees.unclaimedForkEth.value > 0 || reportingFees.unclaimedForkRepStaked.value > 0)

    return (
      <div>
        <section className={Styles.PortfolioReports}>
          <Helmet>
            <title>Reporting</title>
          </Helmet>
          <h4>
            Claim all available stake and fees
          </h4>
          <div className={Styles.PortfolioReports__details}>
            <ul className={Styles.PortfolioReports__info}>
              <li><span>REP</span><span>{reportingFees.unclaimedRep.formatted}</span></li>
              <li><span>ETH</span><span>{reportingFees.unclaimedEth.formatted}</span></li>
            </ul>
            <button
              className={Styles.PortfolioReports__claim}
              disabled={disableClaimReportingFeesNonforkedMarketsButton}
              onClick={this.handleClaimReportingFeesNonforkedMarkets}
            >
              Claim
            </button>
          </div>
        </section>
        {userHasClaimableForkFees &&
          <section className={Styles.PortfolioReports}>
            <h4>
              Forked Market
            </h4>
            <h5>
              REP staked on an outcome of the forking market will be available in the outcome&#39;s corresponding universe once claimed.
            </h5>
            <PortfolioReportsForkedMarketCard
              buttonAction={this.handleClaimReportingFeesForkedMarket}
              currentTimestamp={currentTimestamp}
              finalizeMarket={finalizeMarket}
              forkedMarketReportingFeesInfo={reportingFees.forkedMarket}
              linkType={TYPE_CLAIM_PROCEEDS}
              market={forkedMarket}
              unclaimedForkEth={reportingFees.unclaimedForkEth}
              unclaimedForkRepStaked={reportingFees.unclaimedForkRepStaked}
              updateModal={this.handleClaimReportingFeesNonforkedMarkets}
            />
          </section>
        }
      </div>
    )
  }
}
