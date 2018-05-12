import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { formatAttoRep, formatEther } from 'utils/format-number'
import MarketPortfolioCard from 'modules/market/components/market-portfolio-card/market-portfolio-card'

import { MODAL_CLAIM_REPORTING_FEES_NONFORKED_MARKETS } from 'modules/modal/constants/modal-types'
import Styles from 'modules/portfolio/components/portfolio-reports/portfolio-reports.styles'

export default class PortfolioReports extends Component {
  static propTypes = {
    universe: PropTypes.object.isRequired,
    reporter: PropTypes.string.isRequired,
    getReportingFees: PropTypes.func.isRequired,
    updateModal: PropTypes.func.isRequired,
    forkingMarket: PropTypes.object,

    buttonText: PropTypes.string,
    claimReportingFeesForkedMarket: PropTypes.func.isRequired,
    closePositionStatus: PropTypes.object.isRequired,
    currentTimestamp: PropTypes.number.isRequired,
    history: PropTypes.object.isRequired,
    finalizeMarket: PropTypes.func.isRequired,
    forkThreshold: PropTypes.object.isRequired,
    isForkingMarket: PropTypes.bool,
    isMobile: PropTypes.bool,
    linkType: PropTypes.string,
    location: PropTypes.object.isRequired,
    market: PropTypes.object.isRequired,
    outcomes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      unclaimedEth: {
        value: 0,
        formattedValue: 0,
        formatted: '-',
        roundedValue: 0,
        rounded: '-',
        minimized: '-',
        denomination: '',
        full: '-',
      },
      unclaimedRep: {
        value: 0,
        formattedValue: 0,
        formatted: '-',
        roundedValue: 0,
        rounded: '-',
        minimized: '-',
        denomination: '',
        full: '-',
      },
      unclaimedForkEth: {
        value: 0,
        formattedValue: 0,
        formatted: '-',
        roundedValue: 0,
        rounded: '-',
        minimized: '-',
        denomination: '',
        full: '-',
      },
      unclaimedForkRep: {
        value: 0,
        formattedValue: 0,
        formatted: '-',
        roundedValue: 0,
        rounded: '-',
        minimized: '-',
        denomination: '',
        full: '-',
      },
    }

    this.handleClaimReportingFeesNonforkedMarkets = this.handleClaimReportingFeesNonforkedMarkets.bind(this)
    // this.handleClaimReportingFeesForkedMarket = this.handleClaimReportingFeesForkedMarket.bind(this)
  }

  componentWillMount() {
    const {
      reporter,
      universe,
    } = this.props
    this.props.getReportingFees(universe.id, reporter, (err, result) => {

      if (err) {
        this.setState({
          unclaimedEth: formatEther(0, { decimals: 4, zeroStyled: true }),
          unclaimedRep: formatAttoRep(0, { decimals: 4, zeroStyled: true }),
          unclaimedForkEth: formatEther(0, { decimals: 4, zeroStyled: true }),
          unclaimedForkRep: formatAttoRep(0, { decimals: 4, zeroStyled: true }),
          feeWindows: [],
          forkedMarket: null,
          nonforkedMarkets: [],
        })
        return
      }

      this.setState({
        // unclaimedEth: formatEther(result.total.unclaimedEth, { decimals: 4, zeroStyled: true }),
        // unclaimedRep: formatAttoRep(result.total.unclaimedRepStaked, { decimals: 4, zeroStyled: true }),
        // unclaimedForkEth: formatEther(result.total.unclaimedForkEth, { decimals: 4, zeroStyled: true }),
        // unclaimedForkRep: formatAttoRep(result.total.unclaimedForkRep, { decimals: 4, zeroStyled: true }),
        unclaimedEth: formatEther(1, { decimals: 4, zeroStyled: true }),
        unclaimedRep: formatAttoRep(2, { decimals: 4, zeroStyled: true }),
        unclaimedForkEth: formatEther(124, { decimals: 4, zeroStyled: true }),
        unclaimedForkRep: formatAttoRep(333, { decimals: 4, zeroStyled: true }),
        feeWindows: result.feeWindows,
        forkedMarket: result.forkedMarket,
        nonforkedMarkets: result.nonforkedMarkets,
      })
    })
  }

  handleClaimReportingFeesNonforkedMarkets() {
    const {
      unclaimedEth,
      unclaimedRep,
      feeWindows,
      forkedMarket,
      nonforkedMarkets,
    } = this.state
    this.props.updateModal({
      type: MODAL_CLAIM_REPORTING_FEES_NONFORKED_MARKETS,
      unclaimedEth,
      unclaimedRep,
      feeWindows,
      forkedMarket,
      nonforkedMarkets,
      canClose: true,
    })
  }

  render() {
    const {
      claimReportingFeesForkedMarket,
      closePositionStatus,
      currentTimestamp,
      forkingMarket,
      history,
      finalizeMarket,
      forkThreshold,
      isForkingMarket,
      // isMobile,
      linkType,
      // location,
      // outcomes,
      updateModal,
    } = this.props
    const s = this.state

    let disableClaimReportingFeesNonforkedMarketsButton = ''
    if (s.unclaimedEth.formatted === '-' && s.unclaimedRep.formatted === '-') {
      disableClaimReportingFeesNonforkedMarketsButton = 'disabled'
    }
    const userHasClaimableForkFees = isForkingMarket && forkingMarket && (s.unclaimedForkEth.value > 0 || s.unclaimedForkRep.value > 0)

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
              <li><span>REP</span><span>{s.unclaimedRep.formatted}</span></li>
              <li><span>ETH</span><span>{s.unclaimedEth.formatted}</span></li>
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
              Forking Market
            </h4>
            <h5>
              REP staked on an outcome of the forking market will be available in the outcome&#39;s corresponding universe once claimed.
            </h5>
            <MarketPortfolioCard
              claimReportingFeesForkedMarket={claimReportingFeesForkedMarket}
              closePositionStatus={closePositionStatus}
              currentTimestamp={currentTimestamp}
              finalizeMarket={finalizeMarket}
              forkThreshold={forkThreshold}
              history={history}
              // isMobile={isMobile}
              linkType={linkType}
              // location={location}
              market={forkingMarket}
              // outcomes={outcomes}
              unclaimedForkEth={s.unclaimedForkEth}
              unclaimedForkRep={s.unclaimedForkRep}
              updateModal={updateModal}
              userHasClaimableForkFees={userHasClaimableForkFees}
            />
          </section>
        }
      </div>
    )
  }
}
