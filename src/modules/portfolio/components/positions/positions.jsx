import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import makePath from 'modules/routes/helpers/make-path'

import PositionsMarketsList from 'modules/portfolio/components/positions-markets-list/positions-markets-list'
import { TYPE_DISPUTE, TYPE_CLAIM_PROCEEDS } from 'modules/market/constants/link-types'
import PortfolioStyles from 'modules/portfolio/components/portfolio-view/portfolio-view.styles'
import { MARKETS } from 'modules/routes/constants/views'

export default class Positions extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    openPositionMarkets: PropTypes.array.isRequired,
    reportingMarkets: PropTypes.array.isRequired,
    closedMarkets: PropTypes.array.isRequired,
    closePositionStatus: PropTypes.object.isRequired,
    loadAccountTrades: PropTypes.func.isRequired,
    marketsCount: PropTypes.number.isRequired,
    registerBlockNumber: PropTypes.number,
    claimTradingProceeds: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
  }

  componentWillMount() {
    this.props.loadAccountTrades()
  }

  render() {
    const p = this.props
    return (
      <section>
        <Helmet>
          <title>Positions</title>
        </Helmet>
        { p.marketsCount !== 0 &&
        <div>
          <PositionsMarketsList
            title="Open"
            markets={p.openPositionMarkets}
            closePositionStatus={p.closePositionStatus}
            location={p.location}
            history={p.history}
            isMobile={p.isMobile}
          />
          <PositionsMarketsList
            title="In Reporting"
            markets={p.reportingMarkets}
            closePositionStatus={p.closePositionStatus}
            location={p.location}
            history={p.history}
            linkType={TYPE_DISPUTE}
            positionsDefault={false}
            isMobile={p.isMobile}
          />
          <PositionsMarketsList
            title="Finalized"
            markets={p.closedMarkets}
            closePositionStatus={p.closePositionStatus}
            location={p.location}
            history={p.history}
            positionsDefault={false}
            linkType={TYPE_CLAIM_PROCEEDS}
            claimTradingProceeds={p.claimTradingProceeds}
            isMobile={p.isMobile}
          />
        </div>}
        { p.marketsCount === 0 &&
          <div className={PortfolioStyles.NoMarkets__container} >
            <span>You don&apos;t have any positions.</span>
            <Link
              className={PortfolioStyles.NoMarkets__link}
              to={makePath(MARKETS)}
            >
              <span>Click here to view markets.</span>
            </Link>
          </div>
        }
      </section>
    )
  }
}
