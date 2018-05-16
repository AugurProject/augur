import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import BigNumber from 'bignumber.js'

import { formatAttoRep, formatEther } from 'utils/format-number'

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
      unclaimedForkRepStaked: {
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

    this.handleClaimReportingFeesForkedMarket = this.handleClaimReportingFeesForkedMarket.bind(this)
    this.handleClaimReportingFeesNonforkedMarkets = this.handleClaimReportingFeesNonforkedMarkets.bind(this)
  }

  componentWillMount() {
    this.props.getReportingFees((err, result) => {

      if (err) {
        this.setState({
          unclaimedEth: formatEther(0, { decimals: 4, zeroStyled: true }),
          unclaimedRep: formatAttoRep(0, { decimals: 4, zeroStyled: true }),
          unclaimedForkEth: formatEther(0, { decimals: 4, zeroStyled: true }),
          unclaimedForkRepStaked: formatAttoRep(0, { decimals: 4, zeroStyled: true }),
          feeWindows: [],
          forkedMarket: null,
          nonforkedMarkets: [],
        })
        return
      }

      const unclaimedRepTotal = new BigNumber(result.total.unclaimedRepStaked).plus(new BigNumber(result.total.unclaimedRepEarned))

      this.setState({
        unclaimedEth: formatEther(result.total.unclaimedEth, { decimals: 4, zeroStyled: true }),
        unclaimedRep: formatAttoRep(unclaimedRepTotal, { decimals: 4, zeroStyled: true }),
        unclaimedForkEth: formatEther(result.total.unclaimedForkEth, { decimals: 4, zeroStyled: true }),
        unclaimedForkRepStaked: formatAttoRep(result.total.unclaimedForkRepStaked, { decimals: 4, zeroStyled: true }),
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

  handleClaimReportingFeesForkedMarket = () => {
    const {
      unclaimedForkEth,
      unclaimedForkRepStaked,
      forkedMarket,
    } = this.state
    this.props.updateModal({
      type: MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET,
      unclaimedEth: unclaimedForkEth,
      unclaimedRep: unclaimedForkRepStaked,
      forkedMarket,
      canClose: true,
    })
  }

  render() {
    const {
      currentTimestamp,
      finalizeMarket,
      forkedMarket,
    } = this.props
    const s = this.state
    let disableClaimReportingFeesNonforkedMarketsButton = ''
    if (s.unclaimedEth.formatted === '-' && s.unclaimedRep.formatted === '-') {
      disableClaimReportingFeesNonforkedMarketsButton = 'disabled'
    }
    const userHasClaimableForkFees = s.forkedMarket && (s.unclaimedForkEth.value > 0 || s.unclaimedForkRepStaked.value > 0)

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
              Forked Market
            </h4>
            <h5>
              REP staked on an outcome of the forking market will be available in the outcome&#39;s corresponding universe once claimed.
            </h5>
            <PortfolioReportsForkedMarketCard
              buttonAction={this.handleClaimReportingFeesForkedMarket}
              currentTimestamp={currentTimestamp}
              finalizeMarket={finalizeMarket}
              forkedMarketReportingFeesInfo={s.forkedMarket}
              linkType={TYPE_CLAIM_PROCEEDS}
              market={forkedMarket}
              unclaimedForkEth={s.unclaimedForkEth}
              unclaimedForkRepStaked={s.unclaimedForkRepStaked}
              updateModal={this.handleClaimReportingFeesNonforkedMarkets}
            />
          </section>
        }
      </div>
    )
  }
}
